import { useCallback, useEffect, useState } from 'react'
import type { FolderNode } from '@/features/notes/types'
import { foldersApi } from '@/services/notesApi'

interface UseFoldersState {
  folders: FolderNode[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  createFolder: (folderPath: string) => Promise<FolderNode[]>
  renameFolder: (fromPath: string, toPath: string) => Promise<FolderNode[]>
  deleteFolder: (folderPath: string) => Promise<FolderNode[]>
}

export const useFolders = (): UseFoldersState => {
  const [folders, setFolders] = useState<FolderNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)

    try {
      const nextFolders = await foldersApi.list()
      setFolders(nextFolders)
      setError(null)
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Failed to load folders'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const createFolder = useCallback(
    async (folderPath: string) => {
      const nextFolders = await foldersApi.create({ folderPath })
      setFolders(nextFolders)
      return nextFolders
    },
    [],
  )

  const renameFolder = useCallback(
    async (fromPath: string, toPath: string) => {
      const nextFolders = await foldersApi.rename({ fromPath, toPath })
      setFolders(nextFolders)
      return nextFolders
    },
    [],
  )

  const deleteFolder = useCallback(
    async (folderPath: string) => {
      const nextFolders = await foldersApi.delete({ folderPath })
      setFolders(nextFolders)
      return nextFolders
    },
    [],
  )

  return {
    folders,
    loading,
    error,
    refresh,
    createFolder,
    renameFolder,
    deleteFolder,
  }
}
