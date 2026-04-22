# Verbose Broccoli

A fullstack monorepo with a Phoenix (Elixir) JSON API backend and a Vite + React + TypeScript frontend.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) (v24)
- [Elixir](https://elixir-lang.org/) (v1.19)

## Setup

### 1. Start the database
From the root of the repo:
```bash
docker compose up -d
```

### 2. Start the backend
```bash
cd backend
mix deps.get
mix ecto.create
mix phx.server
```
Backend runs at http://localhost:4000

### 3. Start the frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173

## Testing

### Backend
```bash
cd backend
mix test
```

### Frontend E2E (Playwright)
```bash
cd frontend

# Run all tests headless in the terminal
npm run test:e2e

# Open the Playwright UI (visual test runner)
npm run test:e2e:ui
```

The E2E tests mock the backend API, so the backend does not need to be running.