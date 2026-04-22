# Verbose Broccoli

A fullstack monorepo: Phoenix (Elixir) JSON API backend + Vite + React + TypeScript frontend.

## Stack

| Layer | Tech |
|---|---|
| Backend | Elixir / Phoenix v1.8, Ecto, PostgreSQL 16 |
| Frontend | React 19, TypeScript, Vite, TanStack Query |
| Database | PostgreSQL 16 via Docker |

## Starting the full stack

```bash
# 1. Database (from repo root)
docker compose up -d

# 2. Backend
cd backend
mix deps.get
mix ecto.setup   # creates DB, runs migrations, seeds facts
mix phx.server   # http://localhost:4000

# 3. Frontend (separate terminal)
cd frontend
npm install
npm run dev      # http://localhost:5173
```

## Monorepo layout

```
/
├── backend/        # Phoenix app — see backend/AGENTS.md for agent rules
├── frontend/       # React app  — see frontend/AGENTS.md for agent rules
└── docker-compose.yml
```

Each subdirectory has its own dependency management (`mix` / `npm`) and its own agent instructions file.

## API

The backend exposes a single JSON endpoint the frontend consumes:

```
GET /api/facts/random  →  { "fact": "..." }
```

## Dev workflow

Before committing backend changes, run the precommit alias from `backend/`:

```bash
mix precommit
```

This compiles with warnings-as-errors, checks for unused deps, formats, and runs all tests.

For the frontend, run:

```bash
npm run lint
npm run build
```
