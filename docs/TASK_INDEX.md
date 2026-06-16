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

Continue with `T033` and `T035` in `specs/001-align-dlt-mvp/tasks.md`.

The backend DLT read-only flow is implemented and validated through US3. The frontend
playground implementation is present, but browser/build validation is blocked because
`apps/web/node_modules` is missing. The last `npm install` attempt failed with
`ECONNRESET`, so rerun `npm --prefix apps/web install` when network access is stable,
then run `npm --prefix apps/web run build` and validate `/playground` in the browser.

## Important Context

- Raw DLT research is in `docs/idea.md`.
- Upstream strings must be preserved exactly.
- MVP is read-only discovery; no auth, no booking, no queues, no Redis.
