---
ticket: gh-1
branch: feature-1-local-notes-app-electron-tiptap
summary: Local notes app — Electron, Tiptap, search & organize
ticketing: github-issues
---

# gh-1 — Local notes app (Electron + Tiptap)

**GitHub:** https://github.com/thuva-agentic/notes/issues/1  
**Branch:** `feature-1-local-notes-app-electron-tiptap`  
**Status:** Ready for implementation

## Context

Users need a private, offline desktop notebook with comfortable markdown editing and organization — without accounts, cloud sync, or subscriptions.

## Scope

- Electron + React + TypeScript + Vite scaffold
- Tiptap WYSIWYG editor with markdown shortcuts
- Local persistence: one `.md` file per note in the OS app data folder
- Nested **folder** hierarchy for organization
- Search across title, body, and folder names
- Sort notes (default: title A–Z; also modified/created)
- shadcn/ui + Radix UI + React Icons for layout and controls
- IPC bridge for filesystem CRUD (`contextIsolation: true`)

## Out of Scope

- User accounts / authentication
- Cloud sync or backup
- Multi-user / shared notes
- Mobile apps
- Tags (folders only for v1)
- Import from Notion/Evernote

## Technical Approach

- `electron/main/services/` — app data path resolution, note store (`.md` files + folder tree)
- `electron/main/ipc/notes.ts` — allowlisted IPC: list, read, write, delete, search
- `electron/preload.ts` — typed `window.electronAPI` bridge
- `src/features/notes/lib/` — pure `sortNotes`, `searchNotes`, `buildFolderTree`
- `src/features/notes/components/` — `FolderTree`, `NoteList`, `SearchBar`, `NoteEditor`
- `src/components/ui/` — shadcn primitives
- HashRouter for in-app navigation (folder ↔ note)

## Questions

1. **Storage format:** How should notes be stored locally?
   - **Answer:** One `.md` file per note (in app data folder per Q6)

2. **Organization model:** How should users group notes?
   - **Answer:** Folders (nested hierarchy)

3. **Default sort:** What should the note list default to?
   - **Answer:** Title (A–Z)

4. **Search scope:** Full-text search should match:
   - **Answer:** Title + body + folder names

5. **Editor mode:** Tiptap behavior for v1:
   - **Answer:** WYSIWYG with markdown shortcuts

6. **Data directory:** Where do notes live?
   - **Answer:** Fixed app data folder (`~/Library/Application Support/Notes` etc.)

## Acceptance criteria

- [ ] App launches; empty state invites creating first note
- [ ] Create, edit, save, delete notes — persisted locally across restarts
- [ ] Search returns matching notes (title, body, folder names)
- [ ] Sort controls work (title default A–Z; modified/created available)
- [ ] Nested folder organization works
- [ ] `npm run lint` and `npm run build` pass
- [ ] No network calls required for core note workflows
