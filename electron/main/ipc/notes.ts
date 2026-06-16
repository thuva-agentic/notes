import { ipcMain } from 'electron'
import type {
  CreateFolderInput,
  DeleteFolderInput,
  RenameFolderInput,
  WriteNoteInput,
} from '../../../src/features/notes/types'
import {
  createFolder,
  deleteFolder,
  deleteNote,
  listFolders,
  listNotes,
  readNote,
  renameFolder,
  searchNotes,
  writeNote,
} from '../services/noteStore'

const NOTE_CHANNELS = {
  list: 'notes:list',
  read: 'notes:read',
  write: 'notes:write',
  delete: 'notes:delete',
  search: 'notes:search',
} as const

const FOLDER_CHANNELS = {
  list: 'folders:list',
  create: 'folders:create',
  rename: 'folders:rename',
  delete: 'folders:delete',
} as const

const handleIpc =
  <TArgs extends unknown[], TResult>(
    channel: string,
    handler: (...args: TArgs) => Promise<TResult> | TResult,
  ) => {
    ipcMain.handle(channel, async (_event, ...args: TArgs) => handler(...args))
  }

export const registerNotesIpcHandlers = (): void => {
  handleIpc(NOTE_CHANNELS.list, () => listNotes())
  handleIpc(NOTE_CHANNELS.read, (noteId: string) => readNote(noteId))
  handleIpc(NOTE_CHANNELS.write, (input: WriteNoteInput) => writeNote(input))
  handleIpc(NOTE_CHANNELS.delete, (noteId: string) => deleteNote(noteId))
  handleIpc(NOTE_CHANNELS.search, (query: string) => searchNotes(query))

  handleIpc(FOLDER_CHANNELS.list, () => listFolders())
  handleIpc(FOLDER_CHANNELS.create, (input: CreateFolderInput) =>
    createFolder(input.folderPath),
  )
  handleIpc(FOLDER_CHANNELS.rename, (input: RenameFolderInput) =>
    renameFolder(input.fromPath, input.toPath),
  )
  handleIpc(FOLDER_CHANNELS.delete, (input: DeleteFolderInput) =>
    deleteFolder(input.folderPath),
  )
}

export const NOTES_IPC_CHANNELS = [
  ...Object.values(NOTE_CHANNELS),
  ...Object.values(FOLDER_CHANNELS),
] as const
