import type { NoteMeta, NoteSearchResult } from '@/features/notes/types'

export interface SearchableNote {
  meta: NoteMeta
  body: string
}

const folderPathMatches = (folderPath: string, query: string): boolean => {
  if (folderPath.toLowerCase().includes(query)) {
    return true
  }

  return folderPath
    .split('/')
    .filter((segment) => segment.length > 0)
    .some((segment) => segment.toLowerCase().includes(query))
}

export const searchNotes = (
  notes: readonly SearchableNote[],
  query: string,
): NoteSearchResult[] =>
  notes.flatMap((note) => {
    const normalizedQuery = query.trim().toLowerCase()

    if (normalizedQuery.length === 0) {
      return []
    }

    const matchedIn: NoteSearchResult['matchedIn'] = []

    if (note.meta.title.toLowerCase().includes(normalizedQuery)) {
      matchedIn.push('title')
    }

    if (note.body.toLowerCase().includes(normalizedQuery)) {
      matchedIn.push('body')
    }

    if (folderPathMatches(note.meta.folderPath, normalizedQuery)) {
      matchedIn.push('folder')
    }

    return matchedIn.length > 0 ? [{ meta: note.meta, matchedIn }] : []
  })
