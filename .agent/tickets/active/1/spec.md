# #1 — Local notes app (Electron + Tiptap)

**GitHub:** https://github.com/thuva-agentic/notes/issues/1  
**Branch:** `feature-1-local-notes-app-electron-tiptap`  
**Status:** Ready for implementation — see `tasks.md`

## Summary

Build a cross-platform **Electron** desktop app for taking notes locally. Use **Tiptap** as the markdown editor. UI stack: **Tailwind CSS**, **shadcn/ui**, **Radix UI**, **React Icons**. No authentication. Users can **search**, **sort**, and **group/organize** notes.

## Scope (in)

- Electron + React + TypeScript + Vite scaffold
- Tiptap editor for note content (markdown-oriented)
- Local persistence — all notes on disk, no cloud
- Note list with search (title + body)
- Sort notes (e.g. title, created, updated)
- Group/organize notes (folders, tags, or notebooks — per Q&A)
- shadcn/ui + Radix components for layout, dialogs, menus
- IPC bridge for filesystem CRUD (context-isolated)

## Scope (out)

- User accounts / authentication
- Cloud sync or backup
- Multi-user / shared notes
- Mobile apps
- Import from Notion/Evernote (v2)

## Clarifying questions

Answer inline below before `/dm plan`.

1. **Storage format:** How should notes be stored locally?
   - (a) One `.md` file per note in a user-chosen directory
   - (b) SQLite database with markdown content in rows
   - (c) JSON index + markdown files in app data folder
   - **Answer:** a

2. **Organization model:** How should users group notes?
   - (a) **Folders** (nested hierarchy)
   - (b) **Tags** (many-to-many)
   - (c) **Both** folders and tags
   - (d) **Notebooks** only (flat collections, no nesting)
   - **Answer:** a

3. **Default sort:** What should the note list default to?
   - (a) Last modified (newest first)
   - (b) Title (A–Z)
   - (c) Created date (newest first)
   - **Answer:** b

4. **Search scope:** Full-text search should match:
   - (a) Title only
   - (b) Title + body
   - (c) Title + body + tags/folder names
   - **Answer:** c

5. **Editor mode:** Tiptap behavior for v1:
   - (a) WYSIWYG with markdown shortcuts
   - (b) Split view (markdown source + preview)
   - (c) Plain markdown source with live preview panel
   - **Answer:** a

6. **Data directory:** Where do notes live?
   - (a) Fixed app data folder (`~/Library/Application Support/Notes` etc.)
   - (b) User picks folder on first launch (like Obsidian vault)
   - **Answer:** a

## Technical approach (draft)

- `electron/main/` — note store service, IPC handlers, path validation
- `electron/preload.ts` — allowlisted channels: `notes:list`, `notes:read`, `notes:write`, `notes:delete`, `notes:search`
- `src/features/notes/` — editor (Tiptap), sidebar list, search bar, sort/group controls
- `src/features/notes/lib/` — pure `sortNotes`, `filterNotes`, `groupNotes`, `searchNotes`
- `src/components/ui/` — shadcn primitives (Button, Input, Dialog, DropdownMenu, etc.)
- HashRouter or MemoryRouter for in-app navigation (note list ↔ editor)

## Acceptance criteria

- [ ] App launches; empty state invites creating first note
- [ ] Create, edit, save, delete notes — persisted locally across restarts
- [ ] Search returns matching notes by criteria in Q&A
- [ ] Sort controls work (at least title + date)
- [ ] Group/organize per Q&A (folders/tags/notebooks)
- [ ] `npm run lint` and `npm run build` pass
- [ ] No network calls required for core note workflows

## Notes

- Task: Electron + Tailwind + shadcn + Radix + React Icons; Tiptap MD editor; local storage; search, sort, group/organize; no auth
- Repo: `thuva-agentic/notes` (greenfield)
