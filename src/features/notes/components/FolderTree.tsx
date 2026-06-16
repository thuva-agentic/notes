import { useState } from 'react'
import {
  HiOutlineFolder,
  HiOutlineFolderOpen,
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineTrash,
} from 'react-icons/hi2'
import type { FolderNode } from '@/features/notes/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface FolderTreeProps {
  folders: FolderNode[]
  selectedFolderPath: string
  onSelectFolder: (folderPath: string) => void
  onCreateFolder: (folderPath: string) => Promise<void>
  onRenameFolder: (fromPath: string, toPath: string) => Promise<void>
  onDeleteFolder: (folderPath: string) => Promise<void>
}

type FolderDialogMode = 'create' | 'rename' | 'delete' | null

interface FolderDialogState {
  mode: FolderDialogMode
  targetPath: string
  value: string
}

const initialDialogState: FolderDialogState = {
  mode: null,
  targetPath: '',
  value: '',
}

interface FolderTreeItemProps {
  node: FolderNode
  selectedFolderPath: string
  onSelectFolder: (folderPath: string) => void
  onOpenDialog: (state: FolderDialogState) => void
  depth?: number
}

const FolderTreeItem = ({
  node,
  selectedFolderPath,
  onSelectFolder,
  onOpenDialog,
  depth = 0,
}: FolderTreeItemProps) => {
  const isSelected = selectedFolderPath === node.path
  const Icon = isSelected ? HiOutlineFolderOpen : HiOutlineFolder

  return (
    <li>
      <div
        className={cn(
          'group flex items-center gap-1 rounded-md pr-1',
          isSelected && 'bg-accent',
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <button
          type="button"
          onClick={() => onSelectFolder(node.path)}
          className="flex min-w-0 flex-1 items-center gap-2 py-2 text-left text-sm"
        >
          <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="truncate">{node.name}</span>
        </button>
        <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-7"
            aria-label={`Rename ${node.name}`}
            onClick={() =>
              onOpenDialog({ mode: 'rename', targetPath: node.path, value: node.name })
            }
          >
            <HiOutlinePencilSquare className="size-3.5" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-7"
            aria-label={`Delete ${node.name}`}
            onClick={() =>
              onOpenDialog({ mode: 'delete', targetPath: node.path, value: node.name })
            }
          >
            <HiOutlineTrash className="size-3.5" />
          </Button>
        </div>
      </div>
      {node.children.length > 0 && (
        <ul>
          {node.children.map((child) => (
            <FolderTreeItem
              key={child.path}
              node={child}
              selectedFolderPath={selectedFolderPath}
              onSelectFolder={onSelectFolder}
              onOpenDialog={onOpenDialog}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export const FolderTree = ({
  folders,
  selectedFolderPath,
  onSelectFolder,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
}: FolderTreeProps) => {
  const [dialogState, setDialogState] = useState<FolderDialogState>(initialDialogState)

  const closeDialog = () => setDialogState(initialDialogState)

  const submitDialog = async () => {
    if (dialogState.mode === 'create') {
      const nextPath =
        selectedFolderPath.length > 0
          ? `${selectedFolderPath}/${dialogState.value}`
          : dialogState.value
      await onCreateFolder(nextPath)
    }

    if (dialogState.mode === 'rename') {
      const parent = dialogState.targetPath.includes('/')
        ? dialogState.targetPath.slice(0, dialogState.targetPath.lastIndexOf('/'))
        : ''
      const nextPath =
        parent.length > 0 ? `${parent}/${dialogState.value}` : dialogState.value
      await onRenameFolder(dialogState.targetPath, nextPath)
    }

    if (dialogState.mode === 'delete') {
      await onDeleteFolder(dialogState.targetPath)
    }

    closeDialog()
  }

  return (
    <>
      <div className="flex items-center justify-between border-b px-3 py-2">
        <h2 className="text-sm font-semibold">Folders</h2>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-7"
          aria-label="Create folder"
          onClick={() => setDialogState({ mode: 'create', targetPath: '', value: '' })}
        >
          <HiOutlinePlus className="size-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <ul className="space-y-1 p-2">
          <li>
            <button
              type="button"
              onClick={() => onSelectFolder('')}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent',
                selectedFolderPath === '' && 'bg-accent',
              )}
            >
              <HiOutlineFolderOpen className="size-4 text-muted-foreground" aria-hidden />
              All notes
            </button>
          </li>
          {folders.map((folder) => (
            <FolderTreeItem
              key={folder.path}
              node={folder}
              selectedFolderPath={selectedFolderPath}
              onSelectFolder={onSelectFolder}
              onOpenDialog={setDialogState}
            />
          ))}
        </ul>
      </ScrollArea>

      <Dialog open={dialogState.mode !== null} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogState.mode === 'create' && 'Create folder'}
              {dialogState.mode === 'rename' && 'Rename folder'}
              {dialogState.mode === 'delete' && 'Delete folder'}
            </DialogTitle>
          </DialogHeader>

          {dialogState.mode === 'delete' ? (
            <p className="text-sm text-muted-foreground">
              Delete folder <strong>{dialogState.value}</strong> and everything inside it?
            </p>
          ) : (
            <Input
              value={dialogState.value}
              onChange={(event) =>
                setDialogState((current) => ({ ...current, value: event.target.value }))
              }
              placeholder="Folder name"
              aria-label="Folder name"
            />
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              type="button"
              variant={dialogState.mode === 'delete' ? 'destructive' : 'default'}
              onClick={() => void submitDialog()}
            >
              {dialogState.mode === 'delete' ? 'Delete' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
