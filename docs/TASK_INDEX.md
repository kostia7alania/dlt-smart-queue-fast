# Task Index

## Active Feature

- **Feature**: Persistence and History (Roadmap Phase 2)
- **Directory**: `specs/002-persistence-history`
- **Spec**: `specs/002-persistence-history/spec.md`
- **Plan**: `specs/002-persistence-history/plan.md`
- **Tasks**: `specs/002-persistence-history/tasks.md`

## How to Continue

1. Read `AGENTS.md`.
2. Read `docs/CONSTITUTION.md`.
3. Read `specs/002-persistence-history/spec.md`.
4. Read `specs/002-persistence-history/plan.md`.
5. Open `specs/002-persistence-history/tasks.md`.
6. Start from the first unchecked task.
7. Mark completed tasks as `- [x]` only after validation.

## Current Next Step

All tasks in `specs/002-persistence-history/tasks.md` are complete (2026-07-07) on
branch `feat/002-persistence-history`, validated end-to-end:

- Migrations apply at API startup (embedded runner, `schema_migrations`).
- Live fetches persist offices/work types/slot snapshots and log every fetch attempt
  (including failures) in `dlt_fetches`.
- `/v1/dlt/snapshots/*` and `/v1/dlt/fetches` serve stored data with `fetched_at`
  freshness; 503 when PostgreSQL is down, 404 when nothing is stored.
- Degradation validated live: with PostgreSQL stopped the live endpoints keep hitting
  upstream; with upstream down (observed during validation) snapshots keep serving
  stored data — the core value of this feature.
- Local note: if host port 5432 is taken, start PostgreSQL with
  `POSTGRES_PORT=5433 docker compose up -d` and set `DATABASE_URL` accordingly.

Next: review/merge `feat/002-persistence-history`, then start Roadmap Phase 3
(Map and Calendar UX) as `specs/003-*` per the spec-driven workflow.

## Previous Feature

`specs/001-align-dlt-mvp` (DLT Read-Only Discovery MVP) is fully complete and
validated (2026-07-07) on branch `feat/dlt-readonly-mvp`, ready for review/merge.
Validation notes live in that feature's `tasks.md`; hardening added
`currentDate` format validation covered by `apps/api/internal/http/handler_test.go`.

## Important Context

- Raw DLT research is in `docs/idea.md`.
- Upstream strings must be preserved exactly.
- MVP is read-only discovery; no auth, no booking, no queues, no Redis.
