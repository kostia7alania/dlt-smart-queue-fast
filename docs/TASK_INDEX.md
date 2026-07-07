# Task Index

## Active Feature

- **Feature**: DLT Read-Only Discovery MVP
- **Directory**: `specs/001-align-dlt-mvp`
- **Spec**: `specs/001-align-dlt-mvp/spec.md`
- **Plan**: `specs/001-align-dlt-mvp/plan.md`
- **Tasks**: `specs/001-align-dlt-mvp/tasks.md`

## How to Continue

1. Read `AGENTS.md`.
2. Read `docs/CONSTITUTION.md`.
3. Read `specs/001-align-dlt-mvp/spec.md`.
4. Read `specs/001-align-dlt-mvp/plan.md`.
5. Open `specs/001-align-dlt-mvp/tasks.md`.
6. Start from the first unchecked task.
7. Mark completed tasks as `- [x]` only after validation.

## Current Next Step

All tasks in `specs/001-align-dlt-mvp/tasks.md` are complete (2026-07-07).

- T035: `npm --prefix apps/web install` succeeded; `test`, `lint`, and `build` all pass.
  Note: the `lint` script now calls `eslint .` directly because `next lint` was removed
  in Next.js 16.
- T033: the full browser flow (offices → work availability → vehicles → work types →
  holidays → slots) was validated against the live upstream. Preserved strings
  (`car`, `Car and Motocycle`, `เต็ม`) render unchanged; error states are readable.
- Follow-up hardening: `currentDate` on the slots endpoint is now validated as
  `YYYY-MM-DD` (returns 400 instead of forwarding garbage upstream), covered by
  `apps/api/internal/http/handler_test.go`.

The feature is ready for review/merge of `feat/dlt-readonly-mvp`. The next feature
(e.g. calendar visualization or persistence) should start with a new `specs/00N-*`
directory per the spec-driven workflow.

## Important Context

- Raw DLT research is in `docs/idea.md`.
- Upstream strings must be preserved exactly.
- MVP is read-only discovery; no auth, no booking, no queues, no Redis.
