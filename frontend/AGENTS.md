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

## Testing philosophy

Every new user-facing feature or behaviour change should be accompanied by E2E tests. They don't need to land in the same commit, but they should not be left indefinitely — treat missing tests as an open task.

**The workflow:**

1. **Write the Gherkin first.** Add a scenario to the relevant `.feature` file in `e2e/features/` (or create a new one). Scenarios should be written from the user's perspective and describe what the user sees and does, not implementation details.

2. **Generate the Playwright tests from the Gherkin.** Hand the feature file to an AI agent and ask it to produce the corresponding Playwright tests in `e2e/tests/`. Do not wire up `playwright-bdd` or any step-definition tooling — the Gherkin is a human-readable spec, and the agent is the translation layer.

3. **Structure tests as a user journey.** Group tests under `test.describe` blocks that mirror the feature file structure. Use `beforeEach` for shared setup (mock + navigate). Each `test` is a checkpoint in the journey, not a fully isolated unit.

4. **Mock the API.** Use `page.route()` to mock `http://localhost:4000/api/facts/random` (and any future endpoints). Tests must not require a running backend.

**When to add tests:**
- New component or page → new `.feature` file and matching `.spec.ts`
- New user interaction (button, form, navigation) → new scenario in the relevant `.feature` file
- Bug fix involving visible behaviour → add a scenario that would have caught the bug

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
