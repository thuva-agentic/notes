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

export interface ElectronNotesApi {
  list: () => Promise<NoteMeta[]>
  read: (noteId: string) => Promise<NoteContent>
  write: (input: WriteNoteInput) => Promise<NoteContent>
  delete: (noteId: string) => Promise<void>
  search: (query: string) => Promise<NoteSearchResult[]>
}

export interface ElectronFoldersApi {
  list: () => Promise<FolderNode[]>
  create: (input: CreateFolderInput) => Promise<FolderNode[]>
  rename: (input: RenameFolderInput) => Promise<FolderNode[]>
  delete: (input: DeleteFolderInput) => Promise<FolderNode[]>
}

export interface ElectronApi {
  notes: ElectronNotesApi
  folders: ElectronFoldersApi
}

declare global {
  interface Window {
    electronAPI?: ElectronApi
  }
}

export {}
