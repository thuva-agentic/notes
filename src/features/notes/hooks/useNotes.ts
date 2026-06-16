import { useCallback, useEffect, useState } from 'react'
import type { NoteContent, NoteMeta, NoteSearchResult, WriteNoteInput } from '@/features/notes/types'
import { notesApi } from '@/services/notesApi'

interface UseNotesState {
  notes: NoteMeta[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  readNote: (noteId: string) => Promise<NoteContent | null>
  writeNote: (input: WriteNoteInput) => Promise<NoteContent | null>
  deleteNote: (noteId: string) => Promise<void>
  searchNotes: (query: string) => Promise<NoteSearchResult[]>
}

export const useNotes = (): UseNotesState => {
  const [notes, setNotes] = useState<NoteMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)

    try {
      const nextNotes = await notesApi.list()
      setNotes(nextNotes)
      setError(null)
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Failed to load notes'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const readNote = useCallback(
    (noteId: string) => notesApi.read(noteId),
    [],
  )

  const writeNote = useCallback(
    async (input: WriteNoteInput) => {
      const saved = await notesApi.write(input)
      await refresh()
      return saved
    },
    [refresh],
  )

  const deleteNote = useCallback(
    async (noteId: string) => {
      await notesApi.delete(noteId)
      await refresh()
    },
    [refresh],
  )

  const searchNotes = useCallback(
    (query: string) => notesApi.search(query),
    [],
  )

  return {
    notes,
    loading,
    error,
    refresh,
    readNote,
    writeNote,
    deleteNote,
    searchNotes,
  }
}
