import { useCallback, useEffect, useRef, useState } from 'react'
import { HiOutlineTrash } from 'react-icons/hi2'
import type { NoteContent } from '@/features/notes/types'
import { NoteEditor } from '@/features/notes/components/NoteEditor'
import { NoteTitleInput } from '@/features/notes/components/NoteTitleInput'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

interface NoteEditorPanelProps {
  noteId: string
  readNote: (noteId: string) => Promise<NoteContent | null>
  writeNote: (input: {
    id: string
    folderPath: string
    title: string
    body: string
  }) => Promise<NoteContent | null>
  deleteNote: (noteId: string) => Promise<void>
  onDeleted: () => void
}

const TITLE_SAVE_DEBOUNCE_MS = 400

export const NoteEditorPanel = ({
  noteId,
  readNote,
  writeNote,
  deleteNote,
  onDeleted,
}: NoteEditorPanelProps) => {
  const [note, setNote] = useState<NoteContent | null>(null)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const titleTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)

    void readNote(noteId).then((content) => {
      if (!active) {
        return
      }

      setNote(content)
      setTitle(content?.meta.title ?? '')
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [noteId, readNote])

  const persistNote = useCallback(
    async (nextTitle: string, nextBody: string) => {
      if (!note) {
        return null
      }

      const saved = await writeNote({
        id: note.meta.id,
        folderPath: note.meta.folderPath,
        title: nextTitle,
        body: nextBody,
      })

      if (saved) {
        setNote(saved)
        setTitle(saved.meta.title)
      }

      return saved
    },
    [note, writeNote],
  )

  const handleTitleChange = (nextTitle: string) => {
    setTitle(nextTitle)

    if (!note) {
      return
    }

    if (titleTimeoutRef.current !== null) {
      window.clearTimeout(titleTimeoutRef.current)
    }

    titleTimeoutRef.current = window.setTimeout(() => {
      void persistNote(nextTitle, note.body)
    }, TITLE_SAVE_DEBOUNCE_MS)
  }

  const handleBodySave = (nextBody: string) => {
    if (!note) {
      return
    }

    void persistNote(title, nextBody).then((saved) => {
      if (saved) {
        setNote((current) =>
          current ? { ...current, body: saved.body } : current,
        )
      }
    })
  }

  const handleDelete = async () => {
    await deleteNote(noteId)
    setDeleteOpen(false)
    onDeleted()
  }

  useEffect(
    () => () => {
      if (titleTimeoutRef.current !== null) {
        window.clearTimeout(titleTimeoutRef.current)
      }
    },
    [],
  )

  if (loading) {
    return <p className="p-6 text-sm text-muted-foreground">Loading note...</p>
  }

  if (!note) {
    return <p className="p-6 text-sm text-muted-foreground">Note not found.</p>
  }

  return (
    <div className="flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <NoteTitleInput value={title} onChange={handleTitleChange} />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setDeleteOpen(true)}
        >
          <HiOutlineTrash className="size-4" aria-hidden />
          Delete
        </Button>
      </div>

      <Separator className="my-4" />

      <p className="mb-2 text-xs text-muted-foreground">
        Last updated {new Date(note.meta.updatedAt).toLocaleString()}
      </p>

      <NoteEditor
        noteId={note.meta.id}
        initialBody={note.body}
        onSave={handleBodySave}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete note</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Delete <strong>{note.meta.title}</strong>? This cannot be undone.
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={() => void handleDelete()}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
