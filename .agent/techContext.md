# Tech Context

## Stack (issue #1 — greenfield)

- **Electron** + **React** + **TypeScript** + **Vite**
- **Tailwind CSS v4** (CSS-first config)
- **shadcn/ui** + **Radix UI** primitives
- **React Icons**
- **Tiptap** — markdown / rich-text editor
- Local state: lightweight store (e.g. Zustand) or React state; no server cache needed

## Repository

- GitHub: `thuva-agentic/notes`
- Base branch: `staging` (per `project-config.mdc`)
- Default remote branch on GitHub: `main` (empty repo — `staging` to be created on first push)

## Tooling (to scaffold)

- `npm run dev` | `build` | `lint`
- Electron builder for packaging (later phase)

## Project layout (target)

| Area | Path | Purpose |
|------|------|---------|
| Renderer | `src/` | React app, features, components |
| Main | `electron/` | IPC handlers, FS services |
| Preload | `electron/preload.ts` | Typed `window.electronAPI` bridge |
| Features | `src/features/notes/` | Editor, list, search, organization |

## Dependencies (planned)

- `electron`, `vite`, `react`, `typescript`
- `@tiptap/react`, `@tiptap/starter-kit` (+ markdown extensions per Q&A)
- `tailwindcss`, shadcn/ui components
- `react-icons`

## Constraints

- Strict TypeScript
- Functional-first: pure sort/filter/search in `src/features/notes/lib/`
- All note persistence through main-process IPC
