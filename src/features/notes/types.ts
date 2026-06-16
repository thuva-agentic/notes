export interface NoteMeta {
  id: string
  title: string
  folderPath: string
  createdAt: string
  updatedAt: string
}

export interface NoteContent {
  meta: NoteMeta
  body: string
}

export interface FolderNode {
  name: string
  path: string
  children: FolderNode[]
}

export interface NoteSearchResult {
  meta: NoteMeta
  matchedIn: Array<'title' | 'body' | 'folder'>
}

export interface WriteNoteInput {
  id?: string
  folderPath: string
  title: string
  body: string
}

export interface CreateFolderInput {
  folderPath: string
}

export interface RenameFolderInput {
  fromPath: string
  toPath: string
}

export interface DeleteFolderInput {
  folderPath: string
}
