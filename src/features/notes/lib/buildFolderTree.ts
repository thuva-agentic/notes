import type { FolderNode } from '@/features/notes/types'

const normalizeFolderPath = (folderPath: string): string =>
  folderPath
    .split('/')
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0 && segment !== '.' && segment !== '..')
    .join('/')

const insertFolderPath = (
  nodes: FolderNode[],
  folderPath: string,
): FolderNode[] => {
  const normalizedPath = normalizeFolderPath(folderPath)

  if (normalizedPath.length === 0) {
    return nodes
  }

  const [head, ...rest] = normalizedPath.split('/')
  const existing = nodes.find((node) => node.name === head)

  if (!existing) {
    const path = rest.length > 0 ? [head, ...rest].join('/') : head

    return [
      ...nodes,
      {
        name: head,
        path,
        children:
          rest.length > 0 ? insertFolderPath([], rest.join('/')) : [],
      },
    ]
  }

  return nodes.map((node) =>
    node.name === head
      ? {
          ...node,
          children:
            rest.length > 0
              ? insertFolderPath(node.children, rest.join('/'))
              : node.children,
        }
      : node,
  )
}

const sortFolderNodes = (nodes: FolderNode[]): FolderNode[] =>
  [...nodes]
    .map((node) => ({
      ...node,
      children: sortFolderNodes(node.children),
    }))
    .sort((left, right) => left.name.localeCompare(right.name))

export const buildFolderTree = (folderPaths: readonly string[]): FolderNode[] => {
  const uniquePaths = [...new Set(folderPaths.map(normalizeFolderPath))].filter(
    (folderPath) => folderPath.length > 0,
  )

  const tree = uniquePaths.reduce<FolderNode[]>(
    (accumulator, folderPath) => insertFolderPath(accumulator, folderPath),
    [],
  )

  return sortFolderNodes(tree)
}
