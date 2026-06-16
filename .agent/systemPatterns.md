# System Patterns

## Architecture

```
[Renderer: React + Tiptap + shadcn/ui + HashRouter]
        │
        ▼ IPC (contextBridge — allowlisted channels)
[Main: Electron — noteStore, pathGuard]
        │
        ▼
[Local storage: .md files + nested folders in app data/notes/]
```

- **Feature module**: `src/features/notes/` — types, hooks, components, pure lib
- **Pure functions**: `sortNotes`, `searchNotes`, `buildFolderTree` (unit-tested)
- **Side effects at edges**: Electron main (filesystem), preload IPC bridge, React UI
- **No remote API** — all data local

## Confirmed decisions (issue #1)

| Topic | Decision |
|-------|----------|
| Platform | **Electron** desktop (cross-platform) |
| Editor | **Tiptap** WYSIWYG with `@tiptap/markdown` |
| Storage | One **`.md` file per note** in app data folder |
| Organization | **Nested folders** |
| Default sort | **Title A–Z** |
| Search | Title + body + folder names |
| Auth | **None** |
| UI | Tailwind v4, shadcn/ui, Radix UI, React Icons |

## IPC channels

| Channel | Purpose |
|---------|---------|
| `notes:list` | List all note metadata |
| `notes:read` | Read note content by id |
| `notes:write` | Create/update note |
| `notes:delete` | Delete note file |
| `notes:search` | Full-text search |
| `folders:list` | Nested folder tree |
| `folders:create` | Create folder |
| `folders:rename` | Rename folder |
| `folders:delete` | Delete folder (recursive) |

Preload exposes `window.electronAPI.notes.*` and `window.electronAPI.folders.*`.

## Security

- `contextIsolation: true`, `nodeIntegration: false`
- Allowlisted IPC channels in preload
- `pathGuard.resolveSafePath` prevents directory traversal
- No secrets or network calls for note data in v1

## Critical paths

- Note CRUD: renderer hooks → `notesApi` → preload → main `noteStore`
- Search: main-process `searchNotes` (disk) + renderer `searchNotes` lib (client filter)
- Sort: renderer `sortNotes` pure function on note metadata
