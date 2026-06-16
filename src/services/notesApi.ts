import type {
  CreateFolderInput,
  DeleteFolderInput,
  FolderNode,
  NoteContent,
  NoteMeta,
  NoteSearchResult,
  RenameFolderInput,
  WriteNoteInput,
} from '@/features/notes/types'

const getApi = () => window.electronAPI

export const notesApi = {
  list: (): Promise<NoteMeta[]> => getApi()?.notes.list() ?? Promise.resolve([]),
  read: (noteId: string): Promise<NoteContent | null> =>
    getApi()?.notes.read(noteId) ?? Promise.resolve(null),
  write: (input: WriteNoteInput): Promise<NoteContent | null> =>
    getApi()?.notes.write(input) ?? Promise.resolve(null),
  delete: (noteId: string): Promise<void> =>
    getApi()?.notes.delete(noteId) ?? Promise.resolve(),
  search: (query: string): Promise<NoteSearchResult[]> =>
    getApi()?.notes.search(query) ?? Promise.resolve([]),
}

export const foldersApi = {
  list: (): Promise<FolderNode[]> => getApi()?.folders.list() ?? Promise.resolve([]),
  create: (input: CreateFolderInput): Promise<FolderNode[]> =>
    getApi()?.folders.create(input) ?? Promise.resolve([]),
  rename: (input: RenameFolderInput): Promise<FolderNode[]> =>
    getApi()?.folders.rename(input) ?? Promise.resolve([]),
  delete: (input: DeleteFolderInput): Promise<FolderNode[]> =>
    getApi()?.folders.delete(input) ?? Promise.resolve([]),
}
