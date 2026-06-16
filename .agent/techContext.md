# Tech Context

## Stack (shipped — issue #1)

- **Electron 36** + **electron-vite 3** + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** (`@tailwindcss/vite`, CSS-first `src/index.css`)
- **shadcn/ui** + **Radix UI** primitives
- **React Icons** + **lucide-react** (shadcn)
- **Tiptap 3** — `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/markdown` (WYSIWYG, markdown I/O)
- **react-router-dom** — `HashRouter` for in-app navigation
- **Vitest** — unit tests for pure domain logic
- Local UI state: React hooks (`useNotes`, `useFolders`); no global store

## Repository

- GitHub: `thuva-agentic/notes`
- Base branch: `staging`
- Feature branch: `feature-1-local-notes-app-electron-tiptap`

## Tooling

| Script | Purpose |
|--------|---------|
| `npm run dev` | Electron + Vite dev with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (`src/**/*.test.ts`) |

## Project layout

| Area | Path | Purpose |
|------|------|---------|
| Renderer | `src/` | React app, features, components |
| Main | `electron/main/` | IPC handlers, note store services |
| Preload | `electron/preload.ts` | Typed `window.electronAPI` bridge |
| Features | `src/features/notes/` | Editor, list, search, hooks, lib |
| UI | `src/components/ui/` | shadcn primitives |
| Tests | `src/features/notes/lib/*.test.ts` | Pure function unit tests |

## Data storage

- One `.md` file per note under `app.getPath('userData')/notes/`
- YAML frontmatter: `title`, `createdAt`, `updatedAt`
- Nested folder hierarchy on disk

## Constraints

- Strict TypeScript
- Functional-first: pure `sortNotes`, `searchNotes`, `buildFolderTree` in `src/features/notes/lib/`
- All note persistence through main-process IPC (`contextIsolation: true`)
