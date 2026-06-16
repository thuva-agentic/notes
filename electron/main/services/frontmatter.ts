const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

export interface ParsedFrontmatter {
  meta: Record<string, string>
  body: string
}

export const parseFrontmatter = (raw: string): ParsedFrontmatter => {
  const match = raw.match(FRONTMATTER_PATTERN)

  if (!match) {
    return { meta: {}, body: raw }
  }

  const meta = match[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .reduce<Record<string, string>>((accumulator, line) => {
      const separatorIndex = line.indexOf(':')
      if (separatorIndex === -1) {
        return accumulator
      }

      const key = line.slice(0, separatorIndex).trim()
      const value = line.slice(separatorIndex + 1).trim()
      return { ...accumulator, [key]: value }
    }, {})

  return { meta, body: match[2] }
}

export const serializeFrontmatter = (
  meta: Record<string, string>,
  body: string,
): string => {
  const lines = Object.entries(meta).map(([key, value]) => `${key}: ${value}`)
  return `---\n${lines.join('\n')}\n---\n\n${body}`
}
