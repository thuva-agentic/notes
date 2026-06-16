import {
  mkdir,
  readdir,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises'
import { basename, dirname, extname, join, relative, sep } from 'node:path'
import type {
  FolderNode,
  NoteContent,
  NoteMeta,
  NoteSearchResult,
  WriteNoteInput,
} from '../../../src/features/notes/types'
import { parseFrontmatter, serializeFrontmatter } from './frontmatter'
import { normalizeFolderPath, resolveSafePath } from './pathGuard'
import { getNotesRoot } from './paths'

const MARKDOWN_EXTENSION = '.md'

const toPosixPath = (value: string): string => value.split(sep).join('/')

const slugify = (title: string): string => {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug.length > 0 ? slug : 'untitled'
}

const ensureNotesRoot = async (): Promise<string> => {
  const root = getNotesRoot()
  await mkdir(root, { recursive: true })
  return root
}

const noteIdFromAbsolutePath = (root: string, absolutePath: string): string =>
  toPosixPath(relative(root, absolutePath))

const absolutePathFromNoteId = (root: string, noteId: string): string =>
  resolveSafePath(root, noteId)

const folderPathFromNoteId = (noteId: string): string => {
  const folder = dirname(noteId)
  return folder === '.' ? '' : toPosixPath(folder)
}

const titleFromFileName = (noteId: string): string => {
  const fileName = basename(noteId, MARKDOWN_EXTENSION)
  return fileName.replace(/-/g, ' ')
}

const buildNoteMeta = (
  noteId: string,
  meta: Record<string, string>,
  fileStats: { birthtime: Date; mtime: Date },
): NoteMeta => ({
  id: noteId,
  title: meta.title ?? titleFromFileName(noteId),
  folderPath: folderPathFromNoteId(noteId),
  createdAt: meta.createdAt ?? fileStats.birthtime.toISOString(),
  updatedAt: meta.updatedAt ?? fileStats.mtime.toISOString(),
})

const readNoteFile = async (
  root: string,
  noteId: string,
): Promise<NoteContent> => {
  const absolutePath = absolutePathFromNoteId(root, noteId)
  const [raw, fileStats] = await Promise.all([
    readFile(absolutePath, 'utf8'),
    stat(absolutePath),
  ])
  const { meta, body } = parseFrontmatter(raw)

  return {
    meta: buildNoteMeta(noteId, meta, fileStats),
    body,
  }
}

const walkMarkdownFiles = async function* (
  directory: string,
): AsyncGenerator<string> {
  const entries = await readdir(directory, { withFileTypes: true })

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name)

    if (entry.isDirectory()) {
      yield* walkMarkdownFiles(absolutePath)
      continue
    }

    if (entry.isFile() && extname(entry.name) === MARKDOWN_EXTENSION) {
      yield absolutePath
    }
  }
}

const buildUniqueNoteId = async (
  root: string,
  folderPath: string,
  title: string,
): Promise<string> => {
  const baseName = slugify(title)
  const normalizedFolder = normalizeFolderPath(folderPath)
  let candidate = normalizedFolder
    ? `${normalizedFolder}/${baseName}${MARKDOWN_EXTENSION}`
    : `${baseName}${MARKDOWN_EXTENSION}`

  let suffix = 1

  while (true) {
    try {
      await stat(absolutePathFromNoteId(root, candidate))
      candidate = normalizedFolder
        ? `${normalizedFolder}/${baseName}-${suffix}${MARKDOWN_EXTENSION}`
        : `${baseName}-${suffix}${MARKDOWN_EXTENSION}`
      suffix += 1
    } catch {
      return candidate
    }
  }
}

const sortFolderNodes = (nodes: FolderNode[]): FolderNode[] =>
  [...nodes]
    .map((node) => ({
      ...node,
      children: sortFolderNodes(node.children),
    }))
    .sort((left, right) => left.name.localeCompare(right.name))

const matchesSearch = (
  note: NoteContent,
  query: string,
): NoteSearchResult | null => {
  const normalizedQuery = query.trim().toLowerCase()

  if (normalizedQuery.length === 0) {
    return null
  }

  const matchedIn: NoteSearchResult['matchedIn'] = []

  if (note.meta.title.toLowerCase().includes(normalizedQuery)) {
    matchedIn.push('title')
  }

  if (note.body.toLowerCase().includes(normalizedQuery)) {
    matchedIn.push('body')
  }

  if (note.meta.folderPath.toLowerCase().includes(normalizedQuery)) {
    matchedIn.push('folder')
  }

  return matchedIn.length > 0 ? { meta: note.meta, matchedIn } : null
}

export const listNotes = async (): Promise<NoteMeta[]> => {
  const root = await ensureNotesRoot()
  const notes: NoteMeta[] = []

  for await (const absolutePath of walkMarkdownFiles(root)) {
    const noteId = noteIdFromAbsolutePath(root, absolutePath)
    const note = await readNoteFile(root, noteId)
    notes.push(note.meta)
  }

  return notes
}

export const readNote = async (noteId: string): Promise<NoteContent> => {
  const root = await ensureNotesRoot()
  return readNoteFile(root, noteId)
}

export const writeNote = async (input: WriteNoteInput): Promise<NoteContent> => {
  const root = await ensureNotesRoot()
  const normalizedFolder = normalizeFolderPath(input.folderPath)
  const noteId =
    input.id ??
    (await buildUniqueNoteId(root, normalizedFolder, input.title))

  const absolutePath = absolutePathFromNoteId(root, noteId)
  await mkdir(dirname(absolutePath), { recursive: true })

  const now = new Date().toISOString()
  let createdAt = now

  if (input.id) {
    try {
      const existing = await readNoteFile(root, noteId)
      createdAt = existing.meta.createdAt
    } catch {
      createdAt = now
    }
  }

  const serialized = serializeFrontmatter(
    {
      title: input.title,
      createdAt,
      updatedAt: now,
    },
    input.body,
  )

  await writeFile(absolutePath, serialized, 'utf8')
  return readNoteFile(root, noteId)
}

export const deleteNote = async (noteId: string): Promise<void> => {
  const root = await ensureNotesRoot()
  const absolutePath = absolutePathFromNoteId(root, noteId)
  await rm(absolutePath, { force: true })
}

export const searchNotes = async (query: string): Promise<NoteSearchResult[]> => {
  const root = await ensureNotesRoot()
  const results: NoteSearchResult[] = []

  for await (const absolutePath of walkMarkdownFiles(root)) {
    const noteId = noteIdFromAbsolutePath(root, absolutePath)
    const note = await readNoteFile(root, noteId)
    const match = matchesSearch(note, query)

    if (match) {
      results.push(match)
    }
  }

  return results
}

export const listFolders = async (): Promise<FolderNode[]> => {
  const root = await ensureNotesRoot()

  const collectFolders = async (directory: string): Promise<FolderNode[]> => {
    const entries = await readdir(directory, { withFileTypes: true })
    const folders = await Promise.all(
      entries
        .filter((entry) => entry.isDirectory())
        .map(async (entry) => {
          const absolutePath = join(directory, entry.name)
          const path = toPosixPath(relative(root, absolutePath))

          return {
            name: entry.name,
            path,
            children: await collectFolders(absolutePath),
          }
        }),
    )

    return sortFolderNodes(folders)
  }

  return collectFolders(root)
}

export const createFolder = async (folderPath: string): Promise<FolderNode[]> => {
  const root = await ensureNotesRoot()
  const normalizedFolder = normalizeFolderPath(folderPath)

  if (normalizedFolder.length === 0) {
    throw new Error('Folder path is required')
  }

  const absolutePath = resolveSafePath(root, normalizedFolder)
  await mkdir(absolutePath, { recursive: true })
  return listFolders()
}

export const renameFolder = async (
  fromPath: string,
  toPath: string,
): Promise<FolderNode[]> => {
  const root = await ensureNotesRoot()
  const normalizedFrom = normalizeFolderPath(fromPath)
  const normalizedTo = normalizeFolderPath(toPath)

  if (normalizedFrom.length === 0 || normalizedTo.length === 0) {
    throw new Error('Folder paths are required')
  }

  const source = resolveSafePath(root, normalizedFrom)
  const target = resolveSafePath(root, normalizedTo)
  await rename(source, target)
  return listFolders()
}

export const deleteFolder = async (folderPath: string): Promise<FolderNode[]> => {
  const root = await ensureNotesRoot()
  const normalizedFolder = normalizeFolderPath(folderPath)

  if (normalizedFolder.length === 0) {
    throw new Error('Cannot delete notes root')
  }

  const absolutePath = resolveSafePath(root, normalizedFolder)
  await rm(absolutePath, { recursive: true, force: true })
  return listFolders()
}
