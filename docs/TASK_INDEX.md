# Task Index

## Active Feature

- **Feature**: 2026 Toolchain — Node 26, Biome, golangci-lint
- **Directory**: `specs/005-toolchain-refresh`
- **Spec**: `specs/005-toolchain-refresh/spec.md`
- **Plan**: `specs/005-toolchain-refresh/plan.md`
- **Tasks**: `specs/005-toolchain-refresh/tasks.md`

## How to Continue

1. Read `AGENTS.md`.
2. Read `docs/CONSTITUTION.md`.
3. Read the active feature's `spec.md` and `plan.md`.
4. Open the active feature's `tasks.md`.
5. Start from the first unchecked task.
6. Mark completed tasks as `- [x]` only after validation.

## Current Next Step

Feature 005 (2026 toolchain) is complete and validated (2026-07-07): Node 26.4.0
(Current line, user's explicit choice over LTS), **Biome 2.5 replaces ESLint** for
`apps/web` (lint + format, next/react domains; research in the 005 spec), and
`apps/api` is linted by **golangci-lint v2 with gofumpt** (`make lint`, `make fmt`).
Feature 004 before it delivered PostgreSQL 18 (`compose.yaml`, 18+ volume mount at
`/var/lib/postgresql`), Go 1.26, the DLT-only schema baseline, and removed the
starter mock endpoints (OpenAPI = `/healthz` + 10 `/v1/dlt/*`). `make db-reset`
recreates the disposable local database.

Next candidates (needs a scope decision, see `specs/003-calendar-office-ux/spec.md`
open questions): map view (requires a coordinates source), vehicle-type filter,
cross-office availability comparison.

Local note: if host port 5432 is taken, start PostgreSQL with
`POSTGRES_PORT=5433 docker compose up -d` and set `DATABASE_URL` accordingly.

## Previous Features

`specs/001-align-dlt-mvp`, `specs/002-persistence-history`, and
`specs/003-calendar-office-ux` are complete, validated, and merged to `main`
(2026-07-07). Validation notes live in each feature's `tasks.md`.

## Important Context

- Raw DLT research is in `docs/idea.md`.
- Upstream strings must be preserved exactly.
- MVP is read-only discovery; no auth, no booking, no queues, no Redis.
