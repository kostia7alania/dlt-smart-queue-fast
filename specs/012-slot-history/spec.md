# Feature Specification: Stored Slot History

**Feature Branch**: `012-slot-history`

**Created**: 2026-07-23

**Status**: Complete (validated 2026-07-23)

**Input**: Post-feature-011 audit found that PostgreSQL retains every successful
slot snapshot, while the API and web UI expose only the latest one.

## Problem

The discovery UI can show current or last-known availability, but users cannot
tell whether an office has recently changed from full to available or how often
stored observations exist. The data already exists in `dlt_slot_snapshots`; it
has no bounded read API or user-facing history view.

## User Stories

### User Story 1 - Inspect stored availability observations (Priority: P1)

As a user, I can select an office and exact work option and inspect recent
stored slot observations without triggering the DLT upstream.

**Acceptance Scenarios**:

1. The history page resolves the selected office/work option to its first work
   type using the existing live-with-snapshot-fallback client.
2. History rows are read only from PostgreSQL, newest first, with a bounded
   limit.
3. Each row shows observation time, original `currentDate`, availability state,
   available/total days, and the earliest available day when present.
4. A missing work type or an empty history is an honest empty state, not an
   application error.

### User Story 2 - Share and navigate history state (Priority: P1)

As a user, I can share a History URL and use browser Back/Forward without losing
the office, work option, or result limit.

**Acceptance Scenarios**:

1. `siteId`, exact `keyword`, and supported `limit` values are URL-driven.
2. Invalid query values fall back to safe defaults.
3. Changing a control aborts the obsolete work-type/history request chain.
4. Calendar, Compare, Map, and Home provide context-preserving History links
   where a work type is known or can be resolved.

### User Story 3 - Understand history without relying on color (Priority: P2)

As a keyboard or screen-reader user, I can understand the history summary and
rows through semantic text and native controls.

**Acceptance Scenarios**:

1. Availability states have stable text labels in addition to color.
2. The history is a semantic table with a caption and scoped headers.
3. Loading, empty, persistence-error, and corrupt-snapshot states are distinct.
4. Wide content remains horizontally reachable on narrow screens.

## Requirements

- **FR-001**: `GET /v1/dlt/history/slots` MUST require a positive
  `workTypeId`.
- **FR-002**: The endpoint MUST return newest-first observations and apply a
  default limit of 20 with a maximum of 100.
- **FR-003**: The history endpoint MUST read PostgreSQL only and MUST NOT call
  the DLT upstream.
- **FR-004**: Every stored snapshot MUST be summarized using the existing exact
  upstream full marker (`"เต็ม"`); upstream message/color strings MUST pass
  through unchanged.
- **FR-005**: History states MUST be one of `available`, `full`, or `no_slots`.
- **FR-006**: A malformed stored payload MUST fail explicitly instead of
  silently producing a misleading row.
- **FR-007**: An empty valid history MUST return HTTP 200 with an empty list.
- **FR-008**: The web client MUST support `AbortSignal`, and obsolete chains
  MUST not update current state.
- **FR-009**: Query parameters MUST be the source of truth for page controls.
- **FR-010**: No migration, dependency, background fetch, alert, auth, queue, or
  booking behavior may be added.

## Success Criteria

- **SC-001**: Repository integration tests prove newest-first ordering, limit,
  work-type isolation, and an empty result.
- **SC-002**: Service tests cover `available`, `full`, `no_slots`, malformed
  payload, and no-store behavior.
- **SC-003**: Handler tests cover validation, limit normalization, empty data,
  and exact Thai/message preservation.
- **SC-004**: Browser smoke covers a direct History URL, control changes,
  empty/data states, context links, and Back/Forward.
- **SC-005**: Go tests/lint/format, Node tests, TypeScript, Biome, production
  build, PostgreSQL integration, and `git diff --check` pass.

## Non-Goals

- Polling, scheduled collection, alerts, or notifications.
- Predicting future availability or assigning confidence scores.
- Deleting, compacting, or deduplicating stored observations.
- Exposing raw slot payloads through the new endpoint.
