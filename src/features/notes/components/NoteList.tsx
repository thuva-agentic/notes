import type { NoteMeta, NoteSearchResult } from '@/features/notes/types'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

interface NoteListProps {
  notes: NoteMeta[]
  searchResults: NoteSearchResult[]
  isSearching: boolean
  selectedNoteId: string | null
  onSelectNote: (noteId: string) => void
}

const formatDate = (isoDate: string): string =>
  new Date(isoDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export const NoteList = ({
  notes,
  searchResults,
  isSearching,
  selectedNoteId,
  onSelectNote,
}: NoteListProps) => {
  const items = isSearching
    ? searchResults.map((result) => ({
        note: result.meta,
        folderPath: result.meta.folderPath,
      }))
    : notes.map((note) => ({ note, folderPath: note.folderPath }))

  if (items.length === 0) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        {isSearching ? 'No matching notes.' : 'No notes in this folder.'}
      </p>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <ul className="divide-y">
        {items.map(({ note, folderPath }) => (
          <li key={note.id}>
            <button
              type="button"
              onClick={() => onSelectNote(note.id)}
              className={cn(
                'flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-accent',
                selectedNoteId === note.id && 'bg-accent',
              )}
            >
              <span className="font-medium">{note.title}</span>
              <span className="text-xs text-muted-foreground">
                {isSearching && folderPath.length > 0
                  ? `${folderPath} · `
                  : ''}
                Updated {formatDate(note.updatedAt)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}
