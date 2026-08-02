# Implementation Plan: Map Status Radar

## Technical Context

- Existing Next.js 16 client Map view and Leaflet widget.
- Existing five-value `MapAvailabilityStatus` contract and snapshot-only API.
- Existing URL-driven `keyword`, `available`, and `search` state.
- No backend, schema, dependency, route, or data-collection change.

## Evidence Decision

Three independent read-only audits were run:

1. Official-source research confirmed office choice in Smart Queue and
   nationwide service channels for several specific procedures, but not a
   universal promise for every foreign applicant or every office.
2. UX research found a small context-preservation improvement across discovery
   links, plus duplication risk in another general office guide.
3. Market/product research ranked Map multi-status filtering highest because
   it adds direct utility using already-safe data while avoiding procedure
   inference.

The chosen slice is Map status radar. Alternative-office source cards remain a
possible later handoff, scoped per exact official procedure.

## Constitution Check

- Business status derivation remains in Go and is unchanged.
- Next.js owns only URL parsing, presentation, and local filtering.
- PostgreSQL remains the only datastore and receives no new query.
- Exact DLT strings and status meanings stay unchanged.
- No auth, booking, Redis, queue, worker, notification, or dependency appears.

## Frontend Design

1. Add a page-local `views/map/model/map-status-filter.ts` module. FSD keeps
   single-view presentation logic in the owning view instead of creating a new
   shared entity abstraction.
2. Export a canonical status order plus pure parse, serialize, and toggle
   helpers.
3. Interpret explicit `statuses` first; use `available=1` only when the new
   parameter is absent.
4. Preserve all existing query parameters during radar changes, remove the
   legacy alias after new-control interaction, and keep reset comprehensive.
5. Filter the existing `searchedOffices` list once and pass the result to the
   unchanged Map widget.
6. Turn the current five count labels into status buttons inside a semantic
   fieldset and add an all-status reset action.

## URL Contract

- No `statuses`: all five selected unless legacy `available=1` is present.
- `statuses=available,full`: only those canonical values selected.
- `statuses=none`: empty selection.
- Duplicate and mixed unknown tokens: keep unique known values in canonical
  order.
- Only unknown tokens: fall back to all values.
- New-control interaction serializes canonical order; all selected removes the
  parameter.

## Validation Strategy

The user explicitly requested no time spent on tests. This feature therefore
adds and runs no test suites. The proportional delivery gate is:

- targeted Biome formatting/check;
- TypeScript no-emit validation;
- Node 26 production build with explicit public configuration;
- manual source-level URL case audit;
- exported metadata/client-bundle text inspection;
- `git diff --check`, scope, claim, task-count, and clean-worktree checks.

## Rollback

Revert the page-local model, Map control/filter wiring, metadata/docs, and
Feature 018 artifacts. The API, database, existing stored observations, and
legacy `available=1` links remain untouched.
