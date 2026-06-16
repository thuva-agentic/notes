import { contextBridge, ipcRenderer } from 'electron'

const ALLOWED_CHANNELS = [
  'notes:list',
  'notes:read',
  'notes:write',
  'notes:delete',
  'notes:search',
  'folders:list',
  'folders:create',
  'folders:rename',
  'folders:delete',
] as const

type AllowedChannel = (typeof ALLOWED_CHANNELS)[number]

const isAllowedChannel = (channel: string): channel is AllowedChannel =>
  (ALLOWED_CHANNELS as readonly string[]).includes(channel)

const invoke = <TResult>(
  channel: AllowedChannel,
  ...args: unknown[]
): Promise<TResult> => {
  if (!isAllowedChannel(channel)) {
    return Promise.reject(new Error(`Channel not allowed: ${channel}`))
  }

  return ipcRenderer.invoke(channel, ...args) as Promise<TResult>
}

contextBridge.exposeInMainWorld('electronAPI', {
  notes: {
    list: () => invoke('notes:list'),
    read: (noteId: string) => invoke('notes:read', noteId),
    write: (input: unknown) => invoke('notes:write', input),
    delete: (noteId: string) => invoke('notes:delete', noteId),
    search: (query: string) => invoke('notes:search', query),
  },
  folders: {
    list: () => invoke('folders:list'),
    create: (input: unknown) => invoke('folders:create', input),
    rename: (input: unknown) => invoke('folders:rename', input),
    delete: (input: unknown) => invoke('folders:delete', input),
  },
})
