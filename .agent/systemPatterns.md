# System Patterns

## Architecture (planned)

```
[Renderer: React + Tiptap + shadcn/ui]
        │
        ▼ IPC (contextBridge / preload)
[Main: Electron — FS, dialogs, note index]
        │
        ▼
[Local storage: JSON/SQLite + markdown files on disk]
```

- **Feature module**: `src/features/notes/` — types, hooks, editor, list, search, organization UI
- **Pure functions** for sort, filter, search scoring, grouping logic
- **Side effects at edges**: Electron main (filesystem), IPC bridge, React UI
- **No remote API** — all data local

## Planned decisions (issue #1)

| Topic | Decision |
|-------|----------|
| Platform | **Electron** desktop (cross-platform) |
| Editor | **Tiptap** (markdown) |
| Storage | **Local only** — format TBD in Q&A (files vs SQLite) |
| Auth | **None** |
| UI | Tailwind v4, shadcn/ui, Radix UI, React Icons |

## Security

- `contextIsolation: true`; minimal typed preload API
- Path validation in main before any FS access
- No secrets or network calls for note data in v1

## Critical paths (to implement)

- Note CRUD via IPC → local persistence
- Full-text search across note metadata + body
- Sort and group state in renderer with pure filter/sort helpers
