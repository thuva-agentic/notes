import { useEffect, useState } from 'react'
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'
import type { NoteSearchResult } from '@/features/notes/types'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  onSearch: (query: string) => Promise<NoteSearchResult[]>
  onResultsChange: (results: NoteSearchResult[], query: string) => void
}

export const SearchBar = ({ onSearch, onResultsChange }: SearchBarProps) => {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void (async () => {
        const trimmedQuery = query.trim()
        const results = trimmedQuery.length > 0 ? await onSearch(query) : []
        onResultsChange(results, query)
      })()
    }, 250)

    return () => window.clearTimeout(timeoutId)
  }, [onSearch, onResultsChange, query])

  return (
    <div className="relative">
      <HiOutlineMagnifyingGlass
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search notes..."
        className="pl-9"
        aria-label="Search notes"
      />
    </div>
  )
}
