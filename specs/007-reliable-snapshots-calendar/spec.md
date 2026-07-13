# Feature Specification: Reliable Snapshots and Calendar States

**Feature Branch**: `007-reliable-snapshots-calendar`

**Created**: 2026-07-10

**Status**: Complete (validated 2026-07-13)

**Input**: Repository review after feature 006. Close correctness and usability gaps in
the persisted-list fallback and the calendar's asynchronous states without expanding
the DLT discovery MVP.

## User Scenarios & Testing

### User Story 1 - Fall back to the exact last list result (Priority: P1)

As a user relying on stored data during a DLT outage, I want the offices and work-type
snapshots to represent the complete last successful response, including an empty list,
so removed or unavailable options do not reappear from older rows.

**Acceptance Scenarios**:

1. A successful offices fetch stores both the typed office projection and the complete
   list snapshot with one shared freshness timestamp.
2. A successful work-types fetch stores both typed rows and the complete result for its
   exact `siteId`/`groupId`/`keyword` lookup.
3. An empty successful response is retrievable as an empty snapshot with `fetched_at`;
   it is not treated as missing data and does not expose older rows.
4. Existing slot snapshot behavior and preserved upstream strings remain unchanged.

### User Story 2 - Understand every calendar state (Priority: P2)

As a user changing offices and work options, I want independent loading/error states
and complete freshness information, so one request cannot hide the state of another
and I can tell which data came from PostgreSQL.

**Acceptance Scenarios**:

1. Office-list and calendar requests track loading and errors independently.
2. Retry controls rerun only the failed request.
3. A single notice lists every fallback collection and its `fetched_at` value.
4. A successful empty slots response renders a readable empty state.

### User Story 3 - Operate the calendar without relying on visuals (Priority: P3)

As a keyboard or assistive-technology user, I want named controls and semantic state,
so the calendar is understandable without relying only on arrows, colors, or layout.

**Acceptance Scenarios**:

1. Icon-only month controls have descriptive accessible names.
2. Selected office, work option, and day buttons expose pressed state.
3. Office search has a programmatic label and the offices are represented as a list.
4. Round details have a table caption and scoped column headings.
5. Calendar and playground routes expose unique document titles.

## Requirements

- **FR-001**: PostgreSQL remains the only datastore; no new runtime dependency.
- **FR-002**: Typed office/work-type tables remain populated for future querying.
- **FR-003**: Latest list snapshots MUST distinguish "no snapshot" from "stored empty
  list".
- **FR-004**: Snapshot reads MUST preserve exact upstream field values.
- **FR-005**: Calendar request state MUST remain correct when initial office and
  calendar fetches overlap.
- **FR-006**: Existing FSD boundaries, shadcn components, BEM hooks, and `tw` Tailwind
  prefix conventions MUST remain intact.
- **FR-007**: The feature MUST NOT add auth, booking, queues, Redis, background work,
  or a frontend data library.

## Success Criteria

- **SC-001**: Empty offices and work-type results round-trip as HTTP 200 snapshots with
  empty arrays and freshness.
- **SC-002**: Previous typed rows cannot leak into the exact work-type snapshot response.
- **SC-003**: Go tests, Go lint, Biome, TypeScript, and the production web build pass.
- **SC-004**: The calendar visibly covers loading, error, empty, live, and stored-data
  states and exposes accessible names/state for its controls.

## Non-Goals

- Map/geocoding, vehicle-type mapping, cross-office comparison, booking, background
  refresh, authentication, or a visual redesign.
