import type { NoteSortKey } from '@/features/notes/lib/sortNotes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const SORT_LABELS: Record<NoteSortKey, string> = {
  title: 'Title (A–Z)',
  updatedAt: 'Last modified',
  createdAt: 'Date created',
}

interface SortMenuProps {
  sortKey: NoteSortKey
  onSortKeyChange: (sortKey: NoteSortKey) => void
}

export const SortMenu = ({ sortKey, onSortKeyChange }: SortMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button type="button" variant="outline" size="sm">
        Sort: {SORT_LABELS[sortKey]}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Sort notes</DropdownMenuLabel>
      <DropdownMenuRadioGroup
        value={sortKey}
        onValueChange={(value) => onSortKeyChange(value as NoteSortKey)}
      >
        {(Object.keys(SORT_LABELS) as NoteSortKey[]).map((key) => (
          <DropdownMenuRadioItem key={key} value={key}>
            {SORT_LABELS[key]}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
)
