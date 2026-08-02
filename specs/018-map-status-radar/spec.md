# Feature Specification: Map Status Radar

**Feature Branch**: `018-map-status-radar`

**Created**: 2026-08-02

**Status**: Complete (validated 2026-08-02)

**Input**: Three independent audits found current demand for comparing office
alternatives, while the existing Map already receives and counts five safe
stored statuses but only exposes an `available` binary filter.

## Problem

The Map can distinguish `available`, `full`, `no_slots`, `not_offered`, and
`unknown`, yet users can only show everything or available offices. Someone
investigating alternatives cannot isolate unknown coverage, compare full with
no-upcoming evidence, or share that exact view. Adding another procedure guide
would largely duplicate existing content and risk applicant-specific claims;
the existing stored status contract supports a safer direct improvement.

## User Stories

### User Story 1 - Filter by any stored status (Priority: P1)

As a user scanning alternative offices, I can include or exclude each of the
five last-known statuses without triggering another network request.

**Acceptance Scenarios**:

1. All five statuses are selected by default.
2. Each status count is an accessible toggle with a visible pressed state.
3. Marker and semantic text-list visibility use the same filtered office list.
4. Turning off every status produces an honest empty Map/text result.
5. One action restores all statuses.

### User Story 2 - Share and restore the radar state (Priority: P1)

As a user, I can share a Map URL and restore the exact selected status set.

**Acceptance Scenarios**:

1. `statuses` uses canonical comma-separated values in this order:
   `available,full,no_slots,not_offered,unknown`.
2. An absent `statuses` parameter means all statuses.
3. `statuses=none` represents an intentionally empty selection.
4. Unknown tokens do not hide every office; a wholly invalid value falls back
   to all statuses.
5. Legacy `available=1` still restores available-only when `statuses` is absent.
6. Once a new radar control is used, the canonical `statuses` value replaces
   the legacy alias.

### User Story 3 - Understand counts and filtering (Priority: P2)

As a keyboard or screen-reader user, I can distinguish status evidence counts
from the current visible result count without relying on marker color.

**Acceptance Scenarios**:

1. Status counts cover offices matching the name/site-ID search before status
   filtering.
2. The visible count reports the post-status-filter result.
3. Every toggle exposes its status label, count, and `aria-pressed` state.
4. Availability overlay failure continues to classify offices as `unknown`.
5. Copy keeps the stored-only, freshness, and non-eligibility boundary.

## Requirements

- **FR-001**: The Map MUST support all five existing
  `MapAvailabilityStatus` values and MUST NOT introduce a new status.
- **FR-002**: Status filtering MUST be page-local and MUST NOT trigger an API,
  DLT upstream, database, or background request.
- **FR-003**: URL parsing MUST preserve canonical order, deduplicate values,
  accept `none`, and safely default wholly invalid input to all statuses.
- **FR-004**: Explicit `statuses` MUST take precedence over `available=1`.
- **FR-005**: The existing available-only checkbox MUST remain a compatible
  shortcut and reflect a selected set containing only `available`.
- **FR-006**: Search MUST run before status filtering so count denominators stay
  understandable and stable.
- **FR-007**: The Map widget MUST continue receiving one already-filtered office
  list for both visual and text output.
- **FR-008**: Reset MUST clear search, work option, `statuses`, and the legacy
  alias back to documented defaults.
- **FR-009**: Status controls MUST use native fieldset semantics, text labels,
  keyboard-operable buttons, and `aria-pressed`; color MUST remain supplemental.
- **FR-010**: No dependency, route, API response, Go code, migration, auth,
  booking, eligibility, ranking, distance estimate, worker, alert, or polling
  behavior may be added.

## Success Criteria

- **SC-001**: Direct URL inspection covers absent, one, multiple, `none`,
  legacy, mixed-valid, and wholly invalid status values.
- **SC-002**: TypeScript and Biome accept the page-local parser and UI.
- **SC-003**: The production static build completes with the Map route and
  updated metadata.
- **SC-004**: Source/diff inspection proves only `keyword` changes reload the
  availability overlay; status toggles remain local.
- **SC-005**: The exact 40-task checklist and scope/claim audits pass with no
  test suite, external mutation, push, or deployment.

## Non-Goals

- Sorting or ranking offices by status, date, distance, quality, or eligibility.
- Selecting a Map shortlist for Compare.
- Changing status derivation or freshness semantics.
- Adding procedure, walk-in, document, or any-office acceptance advice.
- Adding automated tests in this user-directed no-test cycle.
