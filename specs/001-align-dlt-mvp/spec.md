# Feature Specification: DLT Read-Only Discovery MVP

**Feature Branch**: `001-align-dlt-mvp`

**Created**: 2026-05-16

**Status**: Draft

**Input**: User description: "Study existing Markdown requirements and organize sequential tasks so any AI can continue from an empty chat while building the DLT parser/visualizer MVP."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover DLT offices and work options (Priority: P1)

As a user planning a Thai driving-license appointment, I want to select a DLT office
and see whether New/Renew work options are available, so I can avoid manually clicking
through the official Smart Queue UI for each office.

**Why this priority**: This is the first external data dependency in the DLT flow and
unblocks every later calendar lookup.

**Independent Test**: Fetch offices, select one office, and verify that the local API
returns the observed `sit_id`, `sit_name`, `tyg_id`, `kw`, and `gotwork` values.

**Acceptance Scenarios**:

1. **Given** the upstream office endpoint is reachable, **When** the user requests offices, **Then** the system returns DLT offices with `app_open`, `sit_id`, and `sit_name`.
2. **Given** a selected `sit_id`, **When** the user requests work availability, **Then** the system returns available filters such as ` NEW THAI` and ` RENEW THAI` without rewriting them.

---

### User Story 2 - Resolve vehicle and work type IDs (Priority: P2)

As a user, I want the app to resolve vehicle types and final work type IDs for a
selected office/work option, so the app can query the calendar without requiring me
to understand the official step sequence.

**Why this priority**: Slot lookup depends on `ve_id` and `tyw_id` values derived from
intermediate upstream requests.

**Independent Test**: For a known office and work option, fetch vehicle types and work
types and verify that `Car and Motocycle`, `car`, and `tyw_id` values are preserved.

**Acceptance Scenarios**:

1. **Given** the vehicle endpoint is reachable, **When** the user requests vehicle types, **Then** the system returns `Motorcycle`, `car`, and `Car and Motocycle` exactly as observed.
2. **Given** a selected office and work option, **When** the user requests work types, **Then** the system returns `tyw_id`, `tyw_name`, `tyw_status`, and `tyw_datestart`.

---

### User Story 3 - View holidays and slot availability (Priority: P3)

As a user, I want to see holidays and slot statuses for a selected work type, so I can
compare appointment availability without opening the official calendar UI.

**Why this priority**: Calendar visualization is the core user value after the lookup
chain is understood.

**Independent Test**: For a known `tyw_id` and date, fetch holidays and slot data and
verify that day statuses, colors, rounds, `count`, and `MaxCount` are exposed.

**Acceptance Scenarios**:

1. **Given** a valid `tyw_id`, **When** the user requests holidays, **Then** the system returns holiday dates.
2. **Given** a valid `tyw_id` and current date, **When** the user requests slot availability, **Then** the system returns calendar dates, status messages, colors, rounds, counts, and maximum counts.
3. **Given** the upstream status is `เต็ม`, **When** the system normalizes the response, **Then** it preserves `เต็ม` exactly.

---

### User Story 4 - Explore the flow in a minimal UI (Priority: P4)

As a developer-user, I want a simple playground page that calls the backend endpoints,
so I can validate the DLT flow manually before investing in map, calendar, or alerts.

**Why this priority**: The MVP needs a thin UI to validate backend behavior without
adding premature product surface.

**Independent Test**: Open the playground, run each DLT lookup step, and confirm that
the displayed JSON matches backend responses.

**Acceptance Scenarios**:

1. **Given** the API is running, **When** the user opens the playground, **Then** the user can trigger office, work, vehicle, work type, holiday, and slot calls.
2. **Given** an upstream or validation error, **When** a request fails, **Then** the UI displays a readable error without crashing.

### Edge Cases

- Upstream API is unavailable or times out.
- Upstream returns empty arrays.
- `count` is a non-numeric string such as `เต็ม`.
- Vehicle and work labels contain misspellings or inconsistent casing.
- `getPersonalProfile` returns `[empty]`.
- Some offices do not expose both New and Renew options.
- A future endpoint may require a real or changing `username`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose a local read-only endpoint for DLT offices.
- **FR-002**: System MUST expose a local read-only endpoint for work availability by office.
- **FR-003**: System MUST expose a local read-only endpoint for vehicle types.
- **FR-004**: System MUST expose a local read-only endpoint for work types needed to derive `tyw_id`.
- **FR-005**: System MUST expose local read-only endpoints for holidays and slot availability by `tyw_id`.
- **FR-006**: System MUST preserve upstream DLT strings exactly, including known misspellings and Thai status text.
- **FR-007**: System MUST return JSON responses only from backend endpoints.
- **FR-008**: System MUST document backend contracts through local OpenAPI docs.
- **FR-009**: System MUST provide a minimal frontend playground that can call the DLT MVP endpoints.
- **FR-010**: System MUST NOT implement login, booking, paid notifications, Redis, queues, or background monitoring in this MVP.

### Key Entities *(include if feature involves data)*

- **DltOffice**: A DLT office with `app_open`, `sit_id`, and `sit_name`.
- **WorkAvailability**: Availability response for an office, including `tyg_id`, `gotwork`, and filters.
- **VehicleType**: Vehicle option with `ve_id` and `ve_name`.
- **WorkType**: Final work type with `tyw_id`, `tyw_name`, `tyw_status`, and `tyw_datestart`.
- **Holiday**: Closed date for a work type.
- **SlotDay**: Calendar day with status message, color, and time rounds.
- **SlotRound**: Time range with `count` and `MaxCount`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can run the local app and retrieve offices, work options, vehicle types, work types, holidays, and slots in under 10 minutes.
- **SC-002**: All DLT MVP endpoints are visible in local OpenAPI docs.
- **SC-003**: The playground can execute the full read-only lookup chain without manual edits to source code.
- **SC-004**: Known upstream strings listed in `docs/idea.md` are preserved exactly in fixtures, DTOs, and displayed responses.
- **SC-005**: The MVP can be validated without user authentication, booking, queues, Redis, or background workers.

## Assumptions

- The MVP is read-only and does not attempt to submit a booking.
- Some upstream endpoints remain reachable without UI authentication.
- Existing example starter endpoints can be replaced or de-prioritized.
- PostgreSQL is available for future persistence, but Phase 1 can start with live read-through endpoints.
- Rate limits and production-safe monitoring behavior are open questions, not MVP implementation scope.
