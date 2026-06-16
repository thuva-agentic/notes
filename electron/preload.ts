import { contextBridge } from 'electron'

const ALLOWED_CHANNELS: string[] = []

contextBridge.exposeInMainWorld('electronAPI', {
  allowedChannels: ALLOWED_CHANNELS,
})
