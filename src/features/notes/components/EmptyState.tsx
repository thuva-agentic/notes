import { HiOutlineDocumentText, HiOutlineFolderPlus } from 'react-icons/hi2'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onCreateNote: () => void
  onCreateFolder: () => void
}

export const EmptyState = ({ onCreateNote, onCreateFolder }: EmptyStateProps) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
    <HiOutlineDocumentText className="size-12 text-muted-foreground" aria-hidden />
    <div className="space-y-1">
      <h2 className="text-xl font-semibold">No notes yet</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Create your first note or add a folder to start organizing your library.
      </p>
    </div>
    <div className="flex gap-2">
      <Button type="button" onClick={onCreateNote}>
        Create note
      </Button>
      <Button type="button" variant="outline" onClick={onCreateFolder}>
        <HiOutlineFolderPlus className="size-4" aria-hidden />
        New folder
      </Button>
    </div>
  </div>
)
