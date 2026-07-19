# Feature Specification: Snapshot Availability on the Office Map

**Feature Branch**: `010-snapshot-map-availability`

**Created**: 2026-07-19

**Status**: Complete (validated 2026-07-19)

**Input**: First actionable backlog item in `docs/TASK_INDEX.md` — availability
coloring on the office map without an unbounded refresh of roughly 210 offices.

## Problem

The map shows where offices are, but every marker currently describes coordinate
precision rather than appointment usefulness. A user still has to open calendars
one by one to learn which previously inspected offices had availability.

Live coloring for every marker is unsafe: resolving one office can cost two DLT
requests and the upstream rate limit is unknown. The repository already stores
complete work-type lookups and raw slot snapshots, so the map can expose useful,
honest last-known state with zero additional upstream traffic.

## Refresh-Budget Decision

- The overlay is **snapshot-only**. Loading or filtering the map never calls the
  DLT upstream and never starts background work.
- PostgreSQL returns the latest stored work-type lookup for the selected keyword
  and the latest slot snapshot for its first work type (the same work-type choice
  used by calendar and compare).
- Offices never inspected before remain `unknown`; the UI explains that opening a
  calendar or running a comparison populates snapshots.
- All freshness timestamps remain visible. The overlay is last-known evidence,
  not a claim of live availability.

## User Stories

### User Story 1 - Scan last-known availability (Priority: P1)

As a user choosing an office, I can switch NEW/RENEW on the map and distinguish
offices whose stored snapshot has an upcoming available day from full, empty,
unsupported, and unknown offices.

**Acceptance Scenarios**:

1. The map loads the office list even when PostgreSQL or the availability overlay
   is unavailable.
2. NEW/RENEW changes only the snapshot query; it makes no live DLT calls.
3. Marker popups show a textual status, snapshot freshness, first available date
   and preserved upstream message when known.
4. "Available only" hides all markers except `available` results.

### User Story 2 - Understand incomplete evidence (Priority: P2)

As a user, I can tell why an office has no green marker and how old the evidence
is, rather than treating missing snapshots as no availability.

**Acceptance Scenarios**:

1. A visible summary counts available/full/no-upcoming/not-offered/unknown offices.
2. Status is conveyed by text and marker shape/size as well as color.
3. The legend explains both availability status and coordinate precision.
4. Calendar deep links remain available for every visible marker.

## API Contract

`GET /v1/dlt/map-availability?keyword=&groupId=&currentDate=`

- `keyword`: required exact upstream string, including leading whitespace.
- `groupId`: optional, default `4`, positive integer.
- `currentDate`: optional, default server today, `YYYY-MM-DD`; stored days before
  this date do not count as upcoming.
- The response echoes resolved parameters and returns one result per stored
  work-type lookup. Offices with no stored lookup are intentionally absent.

Each result contains `sit_id`, `status`, optional `work_type`,
`work_types_fetched_at`, optional `slots_fetched_at`, optional
`snapshot_current_date`, `total_days`, `available_days`, and optional
`first_available` (`date`, `message`, `color`).

Statuses:

- `available`: at least one upcoming day whose exact message is not `เต็ม`.
- `full`: upcoming days exist and every exact message is `เต็ม`.
- `no_slots`: the stored slot payload has no days on or after `currentDate`.
- `not_offered`: the latest complete work-type lookup is an empty list.
- `unknown`: a work type is known but there is no usable stored slot payload.

## Requirements

- **FR-001**: The endpoint MUST read PostgreSQL only and MUST NOT call upstream.
- **FR-002**: Complete work-type snapshots MUST prevent stale projection rows
  from leaking after a successful empty lookup.
- **FR-003**: The summary predicate MUST reuse the exact `เต็ม` contract and
  preserve upstream day message/color unchanged.
- **FR-004**: Corrupt or absent per-office slot payloads MUST degrade that office
  to `unknown` without failing the whole overlay.
- **FR-005**: The UI MUST keep office-list and overlay loading/error states
  independent.
- **FR-006**: Availability MUST NOT be communicated by color alone.
- **FR-007**: Existing FSD boundaries, public APIs, shadcn controls, BEM hooks,
  and `tw:` Tailwind prefix MUST be preserved; no dependency is added.

## Success Criteria

- **SC-001**: Unit tests cover all five statuses, past-day filtering, corrupt
  payload isolation, and no-store/validation errors.
- **SC-002**: PostgreSQL integration coverage proves latest slot selection and
  that an empty work-type collection hides an older typed projection.
- **SC-003**: Go tests/lint, Biome, Node tests, TypeScript, and production build
  pass.
- **SC-004**: Browser smoke confirms keyword switching, available-only filtering,
  textual popup status, legend, and calendar links without console errors.

## Non-Goals

- Live fan-out, polling, background workers, notifications, or freshness SLAs.
- Automatically filling snapshots for offices the user has never inspected.
- Route/distance ranking or vehicle filtering.
