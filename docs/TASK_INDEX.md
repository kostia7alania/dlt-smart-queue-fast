# Task Index

Updated: 2026-09-22.

## Active Feature

No feature is active. Select a ready backlog item and create its Spec Kit
artifacts before changing product behaviour.

[Feature 023](../specs/023-procedural-content-review/tasks.md) completed the
high-intent B03 source review for first licence, renewal, conversion, documents,
fees, expiry and timing. Current official DLT guidance is now a distinct dated
evidence kind; office-specific decisions, the archival conversion sheet and
unresolved conflicts remain explicit. The stricter 30-day maintenance report
still lists 77 claims on 13 lower-priority pages, without silently advancing
their dates.

[Feature 022](../specs/022-search-discovery/tasks.md) completed the Search
Console baseline and a production visitor audit. The exact `workers.dev`
URL-prefix is verified, the sitemap is submitted, and the free build now
publishes only office-directory and map capabilities while preserving the
full-BFF route contracts behind one build-time flag. Synthetic checks do not
count as the 10 real journeys required to close B07.

[Feature 021](../specs/021-cloudflare-free-mvp/tasks.md) completed the first
zero-cost public MVP on the indexable
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

Thai Driving License covers licence journeys, process guides and office
discovery. The free production build exposes the refreshed directory and map;
Calendar, Compare and History remain full-BFF capabilities and are hidden and
noindexed until that backend is deployed. The completed rebrand and office
pages were integrated from
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
office-snapshot release, and Feature 022 is its completed search and public
journey baseline.

## Important Context

- [Raw upstream observations](idea.md) are historical evidence, not the backlog.
- Preserve exact upstream strings, including leading spaces in ` NEW THAI`
  and ` RENEW THAI`, `Car and Motocycle`, and `เต็ม`.
- Stored availability is an observation, not a booking guarantee or proof of
  applicant eligibility. Approximate map anchors are labelled as such.
- If host port 5432 is occupied, use `POSTGRES_PORT=5433 make up` and update
  `DATABASE_URL` to the same port.
