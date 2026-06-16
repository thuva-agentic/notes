import { describe, expect, it } from 'vitest'
import type { NoteMeta } from '@/features/notes/types'
import { sortNotes } from './sortNotes'

const createNote = (overrides: Partial<NoteMeta> & Pick<NoteMeta, 'id'>): NoteMeta => ({
  title: 'Untitled',
  folderPath: '',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
  ...overrides,
})

describe('sortNotes', () => {
  it('sorts by title A-Z by default', () => {
    const notes = [
      createNote({ id: 'b.md', title: 'Beta' }),
      createNote({ id: 'a.md', title: 'Alpha' }),
      createNote({ id: 'c.md', title: 'Gamma' }),
    ]

    const sorted = sortNotes(notes)

    expect(sorted.map((note) => note.title)).toEqual(['Alpha', 'Beta', 'Gamma'])
  })

  it('sorts by updatedAt when requested', () => {
    const notes = [
      createNote({ id: '1.md', updatedAt: '2026-01-03T00:00:00.000Z' }),
      createNote({ id: '2.md', updatedAt: '2026-01-01T00:00:00.000Z' }),
      createNote({ id: '3.md', updatedAt: '2026-01-02T00:00:00.000Z' }),
    ]

    const sorted = sortNotes(notes, 'updatedAt', 'asc')

    expect(sorted.map((note) => note.id)).toEqual(['2.md', '3.md', '1.md'])
  })

  it('uses note id as a stable tie-breaker', () => {
    const notes = [
      createNote({ id: 'z.md', title: 'Same' }),
      createNote({ id: 'a.md', title: 'Same' }),
    ]

    const sorted = sortNotes(notes)

    expect(sorted.map((note) => note.id)).toEqual(['a.md', 'z.md'])
  })
})
