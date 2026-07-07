# Feature Specification: Calendar and Office UX

**Feature Branch**: `003-calendar-ux`

**Created**: 2026-07-07

**Status**: Draft

**Input**: Roadmap Phase 3 - "Map and Calendar UX": office list/map view, calendar
status view for selected office and work type, filters for office, New/Renew,
vehicle type, dates, and availability.

## Scope Notes

- Upstream office data (`sit_id`, `sit_name`, `app_open`) carries **no coordinates**,
  so a real map needs an external geocoding source. This feature ships the **office
  list view**; the map stays an open question documented below. No new frontend
  dependencies are introduced.
- The calendar consumes existing feature 001/002 endpoints only. No backend changes.
- Observed upstream slot statuses (preserved exactly): `เต็ม` (`#FF0000`), `ว่าง`
  (`#25862F`), `ไม่มีคนจอง` (`#25862F`). A slots response spans roughly six months of
  bookable days; dates absent from the response are not bookable.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See slot availability as a calendar (Priority: P1)

As a user planning a DLT appointment, I want a month calendar that colors each day by
its upstream availability status, so I can spot free days without reading raw JSON.

**Why this priority**: The calendar is the core user value of the whole product; all
lookup plumbing exists already.

**Independent Test**: Open `/calendar`, pick the known office/work type
(47 / ` NEW THAI` / 111093), and verify day cells reflect the upstream `message` and
`color` values with month navigation across the returned range.

**Acceptance Scenarios**:

1. **Given** slots data for a work type, **When** the calendar renders, **Then** each returned date shows its upstream status color and preserved message (e.g. `เต็ม`).
2. **Given** a day with rounds, **When** the user selects the day, **Then** the rounds are listed with `round`, `count`, and `MaxCount` values preserved.
3. **Given** holidays data, **When** the calendar renders, **Then** holiday dates are visually marked.
4. **Given** dates not present in the slots response, **When** the calendar renders, **Then** they appear as not bookable (neutral), not as errors.

---

### User Story 2 - Pick an office from a list (Priority: P2)

As a user, I want a searchable office list that drives the calendar, so I can compare
availability across offices without knowing site IDs.

**Independent Test**: Open `/calendar`, search offices by name fragment, select one,
and verify the work-type resolution and calendar reload use the selected `sit_id`.

**Acceptance Scenarios**:

1. **Given** the offices list loads, **When** the user types a name fragment, **Then** the list filters client-side with names preserved exactly.
2. **Given** a selected office, **When** work types resolve, **Then** the calendar loads for the resolved `tyw_id`.
3. **Given** an office without work for the chosen keyword, **When** resolution returns empty, **Then** the UI says so readably instead of showing a stale calendar.

---

### User Story 3 - Filter by work option and availability (Priority: P3)

As a user, I want New/Renew and availability filters, so I can see only days I can
actually book.

**Acceptance Scenarios**:

1. **Given** the keyword toggle (` NEW THAI` / ` RENEW THAI`), **When** the user switches it, **Then** work types re-resolve and the calendar reloads.
2. **Given** the "available only" toggle, **When** enabled, **Then** days whose status is `เต็ม` are dimmed and days with availability stay highlighted.

---

### User Story 4 - Survive upstream outages via snapshots (Priority: P4)

As a user, I want the calendar to fall back to the last stored snapshot when the live
upstream fails, so the page stays useful during outages (observed live during
feature 002 validation).

**Acceptance Scenarios**:

1. **Given** the live slots call fails, **When** a snapshot exists for the work type, **Then** the calendar renders from the snapshot with a visible "stored data from <fetched_at>" notice.
2. **Given** both live and snapshot fail, **When** the page loads, **Then** a readable error appears with a retry control.

### Edge Cases

- Upstream returns an empty slots array — render an empty calendar with a notice.
- Slot `count` is the string `เต็ม` — display verbatim, never coerce to a number.
- Office list unavailable live — fall back to offices snapshot with notice.
- Holidays unavailable (no snapshot exists for holidays) — calendar renders without
  the holiday overlay.
- `tyw_datestart` in the future — out of scope; display what upstream returns.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a `/calendar` page rendering slot days as a month
  calendar with upstream `color` and `message` preserved.
- **FR-002**: Calendar MUST support month navigation across the full returned range.
- **FR-003**: Selecting a day MUST show its rounds (`round`, `count`, `MaxCount`).
- **FR-004**: The page MUST provide a searchable office list driving work-type
  resolution and calendar reload.
- **FR-005**: The page MUST provide a New/Renew keyword toggle and an
  "available only" filter.
- **FR-006**: Live data failures MUST fall back to feature 002 snapshot endpoints
  where they exist, with a visible freshness notice.
- **FR-007**: The page MUST NOT add new frontend dependencies; calendar and list are
  hand-rolled with existing Tailwind styling.
- **FR-008**: Upstream strings MUST be displayed exactly; the UI adds labels around
  them, never rewrites them.

## Success Criteria *(mandatory)*

- **SC-001**: A user can go from opening `/calendar` to seeing colored availability
  for office 47 in two interactions or fewer (defaults preselected).
- **SC-002**: With the upstream down but snapshots populated, the calendar still
  renders stored data with freshness shown.
- **SC-003**: `npm run lint` and `npm run build` pass; no new dependencies in
  `package.json`.
- **SC-004**: Preserved strings (`เต็ม`, `ว่าง`, `ไม่มีคนจอง`, office names) render
  verbatim.

## Open Questions (deferred, documented for Phase 3 follow-up)

- Map view requires office coordinates: manual geocoding dataset, external geocoding
  API, or scraping the official site — needs a scope decision.
- Vehicle-type filter is postponed until multiple `tyw_id` mappings per office are
  catalogued (see `docs/idea.md` open questions).
- Cross-office comparison (calendar per office side by side) is a candidate for 004.

## Assumptions

- Feature 002 endpoints are available (snapshots may be empty on fresh setups).
- The default flow uses `groupId=4` (foreigner driving licence group) as observed in
  `docs/idea.md`; other groups remain accessible via the playground.
