import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { HiOutlineDocumentText } from 'react-icons/hi2'
import type { NoteSearchResult } from '@/features/notes/types'
import { useFolders } from '@/features/notes/hooks/useFolders'
import { useNotes } from '@/features/notes/hooks/useNotes'
import { sortNotes, type NoteSortKey } from '@/features/notes/lib/sortNotes'
import { AppLayout } from '@/features/notes/components/AppLayout'
import { EmptyState } from '@/features/notes/components/EmptyState'
import { FolderTree } from '@/features/notes/components/FolderTree'
import { NoteList } from '@/features/notes/components/NoteList'
import { SearchBar } from '@/features/notes/components/SearchBar'
import { SortMenu } from '@/features/notes/components/SortMenu'
import { Button } from '@/components/ui/button'
import { NoteEditorPanel } from '@/features/notes/components/NoteEditorPanel'

const sortDirectionForKey = (sortKey: NoteSortKey): 'asc' | 'desc' =>
  sortKey === 'title' ? 'asc' : 'desc'

export const NotesWorkspace = () => {
  const navigate = useNavigate()
  const { noteId: encodedNoteId } = useParams()
  const folderMatch = useParams()['*']

  const selectedFolderPath = folderMatch ?? ''
  const selectedNoteId = encodedNoteId ? decodeURIComponent(encodedNoteId) : null

  const { notes, loading, error, writeNote, readNote, deleteNote, searchNotes } = useNotes()
  const {
    folders,
    createFolder,
    renameFolder,
    deleteFolder,
  } = useFolders()

  const [sortKey, setSortKey] = useState<NoteSortKey>('title')
  const [searchResults, setSearchResults] = useState<NoteSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const visibleNotes = useMemo(() => {
    const folderFiltered = notes.filter((note) => note.folderPath === selectedFolderPath)
    return sortNotes(folderFiltered, sortKey, sortDirectionForKey(sortKey))
  }, [notes, selectedFolderPath, sortKey])

  const handleSearch = useCallback(
    async (query: string) => searchNotes(query),
    [searchNotes],
  )

  const handleResultsChange = useCallback(
    (results: NoteSearchResult[], query: string) => {
      setSearchResults(results)
      setIsSearching(query.trim().length > 0)
    },
    [],
  )

  const handleSelectFolder = (folderPath: string) => {
    setIsSearching(false)
    setSearchResults([])
    navigate(folderPath.length > 0 ? `/folder/${folderPath}` : '/')
  }

  const handleSelectNote = (nextNoteId: string) => {
    navigate(`/note/${encodeURIComponent(nextNoteId)}`)
  }

  const handleCreateNote = async () => {
    const saved = await writeNote({
      folderPath: selectedFolderPath,
      title: 'Untitled',
      body: '',
    })

    if (saved) {
      navigate(`/note/${encodeURIComponent(saved.meta.id)}`)
    }
  }

  const handleCreateFolder = async () => {
    const folderName = `folder-${Date.now()}`
    const folderPath =
      selectedFolderPath.length > 0
        ? `${selectedFolderPath}/${folderName}`
        : folderName
    await createFolder(folderPath)
  }

  const showEmptyState =
    !loading && !error && !isSearching && notes.length === 0 && folders.length === 0

  const handleNoteDeleted = () => {
    navigate(selectedFolderPath.length > 0 ? `/folder/${selectedFolderPath}` : '/')
  }

  return (
    <AppLayout
      sidebar={
        <div className="flex h-full flex-col">
          <div className="border-b p-3">
            <div className="mb-3 flex items-center gap-2">
              <HiOutlineDocumentText className="size-5" aria-hidden />
              <h1 className="font-semibold">Notes</h1>
            </div>
            <SearchBar onSearch={handleSearch} onResultsChange={handleResultsChange} />
          </div>
          <FolderTree
            folders={folders}
            selectedFolderPath={selectedFolderPath}
            onSelectFolder={handleSelectFolder}
            onCreateFolder={async (folderPath) => {
              await createFolder(folderPath)
            }}
            onRenameFolder={async (fromPath, toPath) => {
              await renameFolder(fromPath, toPath)
            }}
            onDeleteFolder={async (folderPath) => {
              await deleteFolder(folderPath)
            }}
          />
        </div>
      }
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h2 className="font-semibold">
              {selectedFolderPath.length > 0 ? selectedFolderPath : 'All notes'}
            </h2>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <div className="flex items-center gap-2">
            <SortMenu sortKey={sortKey} onSortKeyChange={setSortKey} />
            <Button type="button" size="sm" onClick={() => void handleCreateNote()}>
              New note
            </Button>
          </div>
        </div>

        {showEmptyState ? (
          <EmptyState
            onCreateNote={() => void handleCreateNote()}
            onCreateFolder={() => void handleCreateFolder()}
          />
        ) : (
          <div className="flex min-h-0 flex-1">
            <div className="flex w-80 min-w-64 flex-col border-r">
              {loading ? (
                <p className="p-4 text-sm text-muted-foreground">Loading notes...</p>
              ) : (
                <NoteList
                  notes={visibleNotes}
                  searchResults={searchResults}
                  isSearching={isSearching}
                  selectedNoteId={selectedNoteId}
                  onSelectNote={handleSelectNote}
                />
              )}
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {selectedNoteId ? (
                <NoteEditorPanel
                  noteId={selectedNoteId}
                  readNote={readNote}
                  writeNote={writeNote}
                  deleteNote={deleteNote}
                  onDeleted={handleNoteDeleted}
                />
              ) : (
                <p className="p-6 text-sm text-muted-foreground">
                  Select a note to start editing.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
