import { normalize, resolve, sep } from 'node:path'

const isWithinRoot = (root: string, target: string): boolean => {
  const resolvedRoot = resolve(root)
  const resolvedTarget = resolve(target)

  return (
    resolvedTarget === resolvedRoot ||
    resolvedTarget.startsWith(`${resolvedRoot}${sep}`)
  )
}

export const assertWithinRoot = (root: string, target: string): string => {
  const normalizedTarget = normalize(target)

  if (!isWithinRoot(root, normalizedTarget)) {
    throw new Error('Path traversal denied')
  }

  return normalizedTarget
}

export const resolveSafePath = (root: string, ...segments: string[]): string => {
  const joined = normalize(resolve(root, ...segments))
  return assertWithinRoot(root, joined)
}

export const normalizeFolderPath = (folderPath: string): string =>
  folderPath
    .split(/[/\\]+/)
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0 && segment !== '.' && segment !== '..')
    .join('/')
