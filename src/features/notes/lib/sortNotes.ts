import type { NoteMeta } from '@/features/notes/types'

export type NoteSortKey = 'title' | 'updatedAt' | 'createdAt'
export type SortDirection = 'asc' | 'desc'

const compareValues = (left: string, right: string): number =>
  left.localeCompare(right, undefined, { sensitivity: 'base' })

const compareNotes = (
  left: NoteMeta,
  right: NoteMeta,
  sortKey: NoteSortKey,
): number => {
  const primary =
    sortKey === 'title'
      ? compareValues(left.title, right.title)
      : compareValues(left[sortKey], right[sortKey])

  if (primary !== 0) {
    return primary
  }

  return compareValues(left.id, right.id)
}

export const sortNotes = (
  notes: readonly NoteMeta[],
  sortKey: NoteSortKey = 'title',
  direction: SortDirection = 'asc',
): NoteMeta[] => {
  const sorted = [...notes].sort((left, right) =>
    compareNotes(left, right, sortKey),
  )

  return direction === 'desc' ? sorted.reverse() : sorted
}
