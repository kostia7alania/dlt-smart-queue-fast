# Task Index

## Active Feature

- **Feature**: Stack Refresh and Schema Baseline
- **Directory**: `specs/004-stack-upgrade`
- **Spec**: `specs/004-stack-upgrade/spec.md`
- **Plan**: `specs/004-stack-upgrade/plan.md`
- **Tasks**: `specs/004-stack-upgrade/tasks.md`

## How to Continue

1. Read `AGENTS.md`.
2. Read `docs/CONSTITUTION.md`.
3. Read the active feature's `spec.md` and `plan.md`.
4. Open the active feature's `tasks.md`.
5. Start from the first unchecked task.
6. Mark completed tasks as `- [x]` only after validation.

## Current Next Step

Feature 004 (stack refresh) is complete and validated (2026-07-07): PostgreSQL 18
(fresh volume, `compose.yaml` with healthcheck, note the 18+ volume mount at
`/var/lib/postgresql`), Node 24 LTS pinned, Go 1.26, all deps latest (ESLint stayed
on 9.x — eslint-config-next crashes under ESLint 10, retry later), single DLT-only
schema baseline, starter mock endpoints removed (OpenAPI = `/healthz` + 10
`/v1/dlt/*`). Local data was destroyed by design; `make db-reset` recreates it.

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
