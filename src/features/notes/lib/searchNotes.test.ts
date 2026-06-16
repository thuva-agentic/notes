import { describe, expect, it } from 'vitest'
import type { NoteMeta } from '@/features/notes/types'
import { searchNotes } from './searchNotes'

const createSearchableNote = (
  meta: Partial<NoteMeta> & Pick<NoteMeta, 'id'>,
  body: string,
) => ({
  meta: {
    title: 'Untitled',
    folderPath: '',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
    ...meta,
  },
  body,
})

describe('searchNotes', () => {
  it('matches title, body, and folder names', () => {
    const notes = [
      createSearchableNote(
        { id: '1.md', title: 'Meeting Notes', folderPath: 'work' },
        'Discuss roadmap',
      ),
      createSearchableNote(
        { id: '2.md', title: 'Ideas', folderPath: 'personal' },
        'grocery list',
      ),
    ]

    expect(searchNotes(notes, 'meeting')).toEqual([
      {
        meta: notes[0].meta,
        matchedIn: ['title'],
      },
    ])

    expect(searchNotes(notes, 'grocery')).toEqual([
      {
        meta: notes[1].meta,
        matchedIn: ['body'],
      },
    ])

    expect(searchNotes(notes, 'work')).toEqual([
      {
        meta: notes[0].meta,
        matchedIn: ['folder'],
      },
    ])
  })

  it('returns no matches for unrelated queries', () => {
    const notes = [
      createSearchableNote({ id: '1.md', title: 'Alpha' }, 'one'),
    ]

    expect(searchNotes(notes, 'missing')).toEqual([])
    expect(searchNotes(notes, '   ')).toEqual([])
  })
})
