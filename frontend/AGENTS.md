# Frontend — Agent Instructions

React 19 + TypeScript frontend built with Vite. Consumes the Phoenix JSON API at `http://localhost:4000`.

## Commands

```bash
npm run dev      # start dev server at http://localhost:5173
npm run build    # tsc -b && vite build (type-check + bundle)
npm run lint     # ESLint
npm run preview  # preview production build locally
```

Run `npm run lint` and `npm run build` before considering any frontend task complete.

## E2E Testing (Playwright)

Tests live in `e2e/tests/`. The corresponding Gherkin specs are in `e2e/features/`.

```bash
# Run all tests headless in the terminal
npm run test:e2e

# Open the Playwright UI (visual test runner with browser preview)
npm run test:e2e:ui
```

- Tests mock the backend API via `page.route()` — the backend does not need to be running.
- When adding new E2E tests, write the Gherkin scenario in `e2e/features/` first, then generate the Playwright test from it.

## Key dependencies

| Package | Purpose |
|---|---|
| `@tanstack/react-query` v5 | Server state, data fetching |
| `react-error-boundary` | Error boundaries |
| `vite` + `@vitejs/plugin-react` | Build tooling (uses Oxc transformer) |

## Component conventions

- Components live in `src/components/`. One component per file, named to match the export.
- `Broccoli.tsx` — top-level UI shell, owns the `<ErrorBoundary>` wrapper.
- `BroccoliFact.tsx` — fetches and displays a fact using `useSuspenseQuery`.

## TanStack Query

- Use `useSuspenseQuery` for data fetching — the parent `<ErrorBoundary>` handles error states and `<Suspense>` handles loading states.
- Query keys are arrays: `["randomFact"]`, `["facts", id]`, etc.
- Keep `queryFn` functions outside the component (module level), typed with explicit return types.

## TypeScript

- All components and functions must be explicitly typed — avoid `any`.
- Define response shape interfaces (e.g. `FactResponse`) alongside the fetch function that returns them.
- TypeScript config is strict (`tsconfig.app.json`). The build will fail on type errors.

## Styling

- Currently uses inline styles (`style={{ ... }}`). Follow the same pattern unless switching to a CSS approach is explicitly requested.
- No CSS-in-JS library is installed.

## Do not

- Do not add a routing library unless explicitly asked — the app is currently single-page with no routes.
- Do not add a state management library (Redux, Zustand, etc.) — TanStack Query handles server state.
- Do not use `React.FC` — prefer plain function declarations with typed props.
