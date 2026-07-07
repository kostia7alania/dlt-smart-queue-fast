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

Feature 002 is specified; implementation starts at `T101` in
`specs/002-persistence-history/tasks.md` on branch `feat/002-persistence-history`.

## Previous Feature

`specs/001-align-dlt-mvp` (DLT Read-Only Discovery MVP) is fully complete and
validated (2026-07-07) on branch `feat/dlt-readonly-mvp`, ready for review/merge.
Validation notes live in that feature's `tasks.md`; hardening added
`currentDate` format validation covered by `apps/api/internal/http/handler_test.go`.

## Important Context

- Raw DLT research is in `docs/idea.md`.
- Upstream strings must be preserved exactly.
- MVP is read-only discovery; no auth, no booking, no queues, no Redis.
