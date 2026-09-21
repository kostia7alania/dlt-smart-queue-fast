# Task Index

Updated: 2026-09-21.

## Active Feature

No feature is active. [Feature 021](../specs/021-cloudflare-free-mvp/tasks.md)
completed the first zero-cost public MVP on the indexable
[`workers.dev` origin](https://thai-driving-license.kostia7alania.workers.dev):
the static Next.js export, a same-origin Worker, one KV office snapshot,
six-hour refresh and a cooldown-protected manual refresh. The committed office
directory remains the failure fallback, and the HTTP boundary stays replaceable
by a later BFF.

The [Mac handoff](HANDOFF.md) consolidates the earlier project discussions,
verified Git state, local startup and the remaining MVP release sequence.
Continue from `main`; the old `dtl-parser-015` worktree has no unique commits.

## Read First

1. `AGENTS.md` and `docs/CONSTITUTION.md` for constraints.
2. [Mac handoff](HANDOFF.md) for the resume commands and MVP acceptance gates.
3. [Project status](PROJECT_STATUS.md) for checked implementation and delivery state.
4. [Product spec](PRODUCT_SPEC.md) for the product and evidence boundaries.
5. [Backlog](BACKLOG.md) for the ordered next work.
6. The active feature's `spec.md`, `plan.md`, and `tasks.md`, if one is active.

Check the current branch, worktrees and remote base before editing. If no
feature is active, select a ready backlog item and specify it before changing
product behavior. Do not restart a completed historical checklist.

## Current Product

Thai Driving License covers licence journeys, process guides, office discovery
and appointment evidence. Calendar, Compare, Map and History are parts of that
journey. The completed rebrand and office pages were integrated from
`feat/016-unified-chrome` into local `main` on 2026-09-11.

Current baseline runtime: static Next.js UI calling a Go API directly, with
PostgreSQL persistence. Completed Feature 021 adds an explicitly authorized,
read-only Cloudflare Worker/KV office snapshot for the free first release; D1,
auth, booking, billing, queues and slot monitoring remain outside the MVP.

## Feature History

All 18 numbered features predating reconciliation are implemented, plus the
parallel `015-local-hubs-guides`, `016-unified-chrome` and
`016-license-authority-rebrand` slices. The numbering collided during parallel
work: use full directory names, not just "015" or "016". Keep the existing
paths to preserve references; new work starts after completed Feature 020.

Validation records remain in each feature's `tasks.md`. The
[roadmap](ROADMAP.md) groups the completed capabilities without repeating
historical validation logs here. Feature 021 is the completed free Cloudflare
office-snapshot release.

## Important Context

- [Raw upstream observations](idea.md) are historical evidence, not the backlog.
- Preserve exact upstream strings, including leading spaces in ` NEW THAI`
  and ` RENEW THAI`, `Car and Motocycle`, and `เต็ม`.
- Stored availability is an observation, not a booking guarantee or proof of
  applicant eligibility. Approximate map anchors are labelled as such.
- If host port 5432 is occupied, use `POSTGRES_PORT=5433 make up` and update
  `DATABASE_URL` to the same port.
