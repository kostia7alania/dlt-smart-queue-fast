# Task Index

## Active Feature

- **Feature**: shadcn/ui + FSD + BEM + Tailwind Prefix
- **Directory**: `specs/006-fsd-ui-kit`
- **Spec**: `specs/006-fsd-ui-kit/spec.md`
- **Tasks**: `specs/006-fsd-ui-kit/tasks.md`

## How to Continue

1. Read `AGENTS.md`.
2. Read `docs/CONSTITUTION.md`.
3. Read the active feature's `spec.md` and `plan.md`.
4. Open the active feature's `tasks.md`.
5. Start from the first unchecked task.
6. Mark completed tasks as `- [x]` only after validation.

## Current Next Step

Feature 006 is complete and validated (2026-07-08): the web app now uses
**shadcn/ui** (Base UI primitives, per `docs/adr/ADR-001-ui-kit-strategy.md`) with
an **FSD layout** (`app` routes → `views` → `widgets` → `features` → `entities` →
`shared`), **BEM semantic hooks** on slice elements, and **Tailwind v4 `tw` prefix**
(unprefixed classes are BEM hooks only). Add UI components with `npx shadcn add` —
components.json carries the aliases and prefix.

Recent platform state (005/004): Node 26.4.0, Biome 2.5 (web lint/format),
golangci-lint v2 + gofumpt (`make lint`, `make fmt`), PostgreSQL 18 (`compose.yaml`,
volume at `/var/lib/postgresql`), Go 1.26, DLT-only schema baseline
(`make db-reset` recreates the disposable local DB).

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
