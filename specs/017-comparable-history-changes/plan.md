# Implementation Plan: Comparable Stored History Changes

## Technical Context

- Go 1.26 API with Huma and the existing PostgreSQL-only history service.
- Next.js 16 App Router, React 19, TypeScript 6, Biome, Tailwind v4 with the
  `tw` prefix, shadcn/Base UI primitives, and the repository's FSD layers.
- No migration or new request is necessary; every input already exists in the
  bounded history response.

## Evidence Decision

Three independent audits were run before implementation. Current external
evidence supports helping people evaluate alternative offices, but it does not
support promising that every foreign applicant can use every office. The
stronger immediately implementable gap is internal: public copy says History
helps users check what changed, while the UI only shows isolated rows.

Feature 017 therefore adds honest comparable status transitions first. A
separate alternative-office decision guide remains a candidate for later
evidence-backed work.

## Constitution Check

- Business comparison semantics live in Go.
- PostgreSQL remains the only datastore, and History remains stored-only.
- The web layer only derives presentation insight from explicit API fields.
- Exact DLT strings pass through unchanged.
- No auth, booking, Redis, queue, worker, polling, alert, dependency, or
  external mutation is introduced.

## Backend Design

1. Add a four-value comparison contract to each history DTO entry.
2. Decode and summarize every snapshot exactly as before.
3. In a second pass, compare each entry with the next older loaded entry.
4. Return `not_comparable` when `current_date` differs, `changed` with
   `previous_status` when the summaries differ, `unchanged` when they match,
   and `no_baseline` for the oldest loaded row.
5. Keep malformed-payload failure atomic: no partially annotated result is
   returned.

## Frontend Design

1. Extend the existing history response types with the server comparison enum.
2. Keep single-page presentation logic in `views/history/model` in accordance
   with the project's FSD rules; do not create a speculative shared entity.
3. Derive the current comparable run, comparison counts, and latest comparable
   transition without duplicating the server's `current_date` rule.
4. Add a semantic change section and textual row cues to the existing History
   page. No new route, query parameter, or client request is needed.
5. Describe transitions as brackets between observations, never exact event
   times.

## Validation Strategy

- During implementation: focused Go service/handler tests and one native Node
  model test file.
- Final proportional gate: Go format, targeted Go packages, Node model tests,
  TypeScript, Biome, production web build, `git diff --check`, claim audit, and
  exact 30-task recount.
- Skip PostgreSQL integration, full Go repository tests, browser automation,
  and image-level UI testing because no query, schema, route, responsive table
  structure, or external integration changes.

## Rollback

Revert the DTO comparison fields, the service annotation pass, the page-local
model/UI block, its tests, and Feature 017 documentation. Stored data and
database schema remain untouched.
