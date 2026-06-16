import { app } from 'electron'
import { join, normalize } from 'node:path'

export const NOTES_DIR_NAME = 'notes'

export const getNotesRoot = (): string =>
  normalize(join(app.getPath('userData'), NOTES_DIR_NAME))
