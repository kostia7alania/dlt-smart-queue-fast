# Task Index

## Active Feature

- **Feature**: Calendar and Office UX (Roadmap Phase 3, list + calendar slice)
- **Directory**: `specs/003-calendar-office-ux`
- **Spec**: `specs/003-calendar-office-ux/spec.md`
- **Plan**: `specs/003-calendar-office-ux/plan.md`
- **Tasks**: `specs/003-calendar-office-ux/tasks.md`

## How to Continue

1. Read `AGENTS.md`.
2. Read `docs/CONSTITUTION.md`.
3. Read the active feature's `spec.md` and `plan.md`.
4. Open the active feature's `tasks.md`.
5. Start from the first unchecked task.
6. Mark completed tasks as `- [x]` only after validation.

## Current Next Step

Features 001, 002, and 003 are complete, reviewed, and **merged to `main`**
(2026-07-07). Pre-merge review re-validated decisions against current external
guidance: AGENTS.md is a Linux Foundation standard and Claude Code still needs a
root `CLAUDE.md` importing `@AGENTS.md` (added); shared `.claude/` project config is
now committed (only `settings.local.json` stays local); huma upgraded to v2.38.0 and
chi to v5.3.1; a stale-response race in the calendar was fixed.

Feature 003 validation notes:
- Calendar renders live data for office 47 defaults; upstream colors/messages
  (`เต็ม`, `ว่าง`, `ไม่มีคนจอง`) verbatim; day details show rounds.
- Snapshot fallback verified with a simulated live outage: calendar renders stored
  data with a freshness notice; when no snapshot matches, a readable error + retry.
- Real upstream outage was observed during the session — snapshots kept working.

Next candidates (needs a scope decision, see `specs/003-calendar-office-ux/spec.md`
open questions): map view (requires a coordinates source), vehicle-type filter,
cross-office availability comparison (004).

Local note: if host port 5432 is taken, start PostgreSQL with
`POSTGRES_PORT=5433 docker compose up -d` and set `DATABASE_URL` accordingly.

## Previous Features

`specs/001-align-dlt-mvp` and `specs/002-persistence-history` are complete,
validated, and merged to `main` (2026-07-07). Validation notes live in each
feature's `tasks.md`.

## Important Context

- Raw DLT research is in `docs/idea.md`.
- Upstream strings must be preserved exactly.
- MVP is read-only discovery; no auth, no booking, no queues, no Redis.
