# Tasks: Local notes app — Electron, Tiptap, search & organize

**Spec:** `.agent/tickets/active/1/spec.md`
**Branch:** `feature-1-local-notes-app-electron-tiptap`
**Ticket:** [gh-1](https://github.com/thuva-agentic/notes/issues/1)
**Status:** In Progress

---

## Phase 1: Electron + Vite + React scaffold

- [x] Add `package.json` with `electron`, `electron-vite`, `react`, `react-dom`, `typescript`, and scripts: `dev`, `build`, `lint`, `preview`
- [x] Add `electron.vite.config.ts` — separate entries for `main`, `preload`, and `renderer`
- [x] Add `electron/main/index.ts` — create `BrowserWindow` with `contextIsolation: true`, `nodeIntegration: false`, load renderer
- [x] Add `electron/preload.ts` — stub `contextBridge.exposeInMainWorld('electronAPI', {})` with empty allowlist placeholder
- [x] Add `src/main.tsx` and `src/App.tsx` — mount minimal React root ("Notes" heading)
- [x] Add `tsconfig.json`, `tsconfig.node.json` — strict TypeScript, path aliases if needed
- [x] Add `.gitignore` entries for `dist/`, `out/`, `release/` (merge with existing)

## Phase 2: Tailwind v4 + shadcn/ui foundation

- [x] Add Tailwind CSS v4 via `@tailwindcss/vite` and `src/index.css` with `@import "tailwindcss"`
- [x] Run `shadcn` init; add `src/lib/utils.ts` with `cn()` helper
- [x] Add shadcn primitives: `Button`, `Input`, `ScrollArea`, `Separator`, `DropdownMenu`, `Dialog`
- [x] Wire global styles and base font in `src/main.tsx`
- [x] Add `react-icons` and verify an icon renders in `App.tsx`

## Phase 3: Local note storage (main process)

- [x] Add `electron/main/services/paths.ts` — resolve OS app data dir (`app.getPath('userData')/notes`) with path normalization
- [x] Add `src/features/notes/types.ts` — `NoteMeta`, `NoteContent`, `FolderNode`, `NoteSearchResult`
- [x] Add `electron/main/services/noteStore.ts` — list/read/write/delete `.md` files; nested folder CRUD; frontmatter or sidecar for title/dates
- [x] Add `electron/main/services/pathGuard.ts` — validate resolved paths stay under notes root (no traversal)
- [x] Add `electron/main/ipc/notes.ts` — `ipcMain.handle` for `notes:list`, `notes:read`, `notes:write`, `notes:delete`, `notes:search`, `folders:*`
- [x] Register IPC handlers in `electron/main/index.ts` on `app.whenReady`

## Phase 4: Preload bridge & renderer API

- [x] Update `electron/preload.ts` — allowlist channels and expose typed `notes.list`, `notes.read`, `notes.write`, `notes.delete`, `notes.search`, `folders.*`
- [x] Add `src/types/electron.d.ts` — `Window.electronAPI` interface matching preload
- [x] Add `src/services/notesApi.ts` — thin IPC wrappers with optional chaining for tests
- [x] Add `src/features/notes/hooks/useNotes.ts` — load note list, refresh on mutations
- [x] Add `src/features/notes/hooks/useFolders.ts` — load folder tree, create/rename/delete folder actions

## Phase 5: Pure domain logic

- [x] Add `src/features/notes/lib/sortNotes.ts` — sort by title (A–Z default), `updatedAt`, `createdAt` (pure fn)
- [x] Add `src/features/notes/lib/searchNotes.ts` — match query against title, body, and folder path segments (case-insensitive)
- [x] Add `src/features/notes/lib/buildFolderTree.ts` — build nested `FolderNode[]` from flat paths
- [x] Add `src/features/notes/lib/sortNotes.test.ts` — title, date, stable tie-breaking
- [x] Add `src/features/notes/lib/searchNotes.test.ts` — title, body, folder name matches; no false positives

## Phase 6: App shell & folder navigation

- [ ] Add `src/features/notes/components/AppLayout.tsx` — resizable sidebar + main editor pane
- [ ] Add `src/features/notes/components/FolderTree.tsx` — nested folder tree with create/rename/delete (Radix/shadcn)
- [ ] Add `src/features/notes/components/NoteList.tsx` — note rows for selected folder; default sort title A–Z
- [ ] Add `src/features/notes/components/SortMenu.tsx` — dropdown to switch sort (title / modified / created)
- [ ] Add `src/features/notes/components/SearchBar.tsx` — filters list via `searchNotes`; shows folder path in results
- [ ] Add `src/features/notes/components/EmptyState.tsx` — first-run CTA to create folder or note
- [ ] Add `HashRouter` in `App.tsx` — routes for folder selection and note editor view

## Phase 7: Tiptap editor & note CRUD

- [ ] Install `@tiptap/react`, `@tiptap/starter-kit`, and markdown shortcut extensions for WYSIWYG
- [ ] Add `src/features/notes/components/NoteEditor.tsx` — Tiptap editor, debounced save via `notesApi.write`
- [ ] Add `src/features/notes/components/NoteTitleInput.tsx` — editable title synced to note metadata
- [ ] Wire "New note" action — create `.md` in selected folder, navigate to editor
- [ ] Wire "Delete note" — confirm via `Dialog`, then `notesApi.delete` and refresh list
- [ ] Persist `updatedAt` on each save; verify notes survive app restart

## Phase 8: Docs, acceptance & verification

- [ ] Add `README.md` — prerequisites, `npm run dev`, project layout, app data location per OS
- [ ] Update `.agent/techContext.md` and `.agent/systemPatterns.md` with confirmed stack and IPC channels
- [ ] Verify acceptance: launch, CRUD, search (title/body/folder), sort (title default), nested folders, no network
- [ ] Run `npm run lint` — fix any failures
- [ ] Run `npm run build` — fix any failures
- [ ] Run `npm test` (if configured) — domain unit tests pass

---
_Generated by /dmx/plan. Edit freely — this is your implementation contract._
