# Notes Local-First Desktop Notes App

Local-first desktop notes app built with Electron, React, and Tiptap. All notes are stored on disk — no account or cloud sync required.

## Prerequisites

- Node.js 20+
- npm 10+

## Development

```bash
npm install
npm run dev
```

Other scripts:

| Command | Purpose |
| --- | --- |
| `npm run build` | Production build (main, preload, renderer) |
| `npm run preview` | Preview production build in Electron |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |

## Project layout

```
electron/
  main/           # Electron main process, IPC, note store
  preload.ts      # contextBridge API
src/
  features/notes/ # Notes domain (hooks, components, lib)
  components/ui/  # shadcn/ui primitives
  services/       # Renderer IPC wrappers
.agent/           # Memory bank & ticket specs
```

## Where notes are stored

Notes live under the OS app data directory in a `notes/` subfolder (one `.md` file per note, YAML frontmatter for title and dates):

| OS | Path |
| --- | --- |
| macOS | `~/Library/Application Support/notes/notes/` |
| Windows | `%APPDATA%/notes/notes/` |
| Linux | `~/.config/notes/notes/` |

## Features (v1)

- Create, edit, and delete notes with a Tiptap markdown editor
- Nested folders for organization
- Search across title, body, and folder names
- Sort by title (default A–Z), last modified, or created date
- No authentication or network calls for core workflows

## Ticket

GitHub issue [#1](https://github.com/thuva-agentic/notes/issues/1) — local notes app.
