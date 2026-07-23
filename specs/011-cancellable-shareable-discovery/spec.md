# Feature Specification: Cancellable, Shareable Discovery

**Feature Branch**: `011-cancellable-shareable-discovery`

**Created**: 2026-07-23

**Status**: Complete (validated 2026-07-23)

**Input**: Post-feature-010 code audit of the calendar, comparison, and map
discovery flows.

## Problem

The core discovery pages work, but their state and request lifecycles are not
yet consistently browser-native:

- Calendar and Map selections are only partly represented in the URL, so
  refresh, sharing, and Back/Forward can silently change the view.
- UI request guards stop stale state writes but do not cancel the underlying
  HTTP request. That can waste DLT traffic, and an aborted live request can
  incorrectly start a snapshot fallback.
- Compare can finish an old run after the user changes offices or work option.
- Compare-to-calendar links drop the selected work option.
- The Leaflet map is primarily visual and lacks an equivalent filtered text
  path for keyboard, screen-reader, and low-bandwidth users.

## User Stories

### User Story 1 - Share and restore discovery state (Priority: P1)

As a user, I can copy a Calendar, Compare, or Map URL and reopen the same
office/work-option/filter state. Browser Back and Forward restore those states.

**Acceptance Scenarios**:

1. Calendar URL state includes `siteId`, `keyword`, and `available=1` when
   enabled.
2. Compare URL state includes deduplicated positive `siteIds` (maximum eight)
   and the exact upstream `keyword`.
3. Map URL state includes exact `keyword`, optional `available=1`, and optional
   office `search`.
4. Invalid query values fall back to safe defaults and the UI never invents an
   upstream keyword.

### User Story 2 - Stop obsolete work (Priority: P1)

As a user switching offices or filters, obsolete requests stop instead of
continuing in the browser or Go comparison loop.

**Acceptance Scenarios**:

1. A new Calendar selection aborts the previous work-type/slot/holiday chain.
2. A changed Compare selection or keyword aborts and clears the previous run.
3. An aborted live request never starts a snapshot fallback and is not shown as
   an application error.
4. A canceled Go comparison exits before starting another office request.

### User Story 3 - Use the map without relying on the canvas (Priority: P2)

As a user, I can search the map's offices and use an equivalent text list with
status and links to Calendar or Compare.

**Acceptance Scenarios**:

1. Search matches office names or numeric site IDs and is represented in the
   URL.
2. Visible counts distinguish the current filtered set from all offices.
3. Reset clears search and availability-only while preserving the default work
   option.
4. Every visible marker has a corresponding text-list row with status plus
   keyword-preserving Calendar and Compare links.

## Requirements

- **FR-001**: Existing exact DLT keywords (`" NEW THAI"`, `" RENEW THAI"`) MUST
  remain the only accepted work-option query values.
- **FR-002**: URL parsing MUST accept only positive integer site IDs, deduplicate
  them, and enforce the existing eight-office Compare cap.
- **FR-003**: All browser fetch helpers MUST accept optional `AbortSignal`.
- **FR-004**: Abort errors MUST bypass live-to-snapshot fallback and best-effort
  holiday suppression.
- **FR-005**: Compare's Go service MUST stop promptly when `ctx.Done()` fires.
- **FR-006**: Query parameters MUST be the source of truth for shareable page
  controls so Back/Forward does not get overwritten by stale local state.
- **FR-007**: Map filtering MUST happen once in the Map view; the widget receives
  the already-visible offices.
- **FR-008**: The map's text alternative MUST use semantic list/link controls and
  expose status without relying on marker color.
- **FR-009**: Reused form-control IDs MUST be unique per component instance.
- **FR-010**: No dependency, authentication, background worker, queue, or live
  map fan-out may be added.

## Success Criteria

- **SC-001**: Native Node tests cover keyword, boolean, site-ID, and office-search
  helpers.
- **SC-002**: Go tests prove a pre-canceled comparison makes zero upstream calls
  and returns zero rows.
- **SC-003**: Browser smoke covers direct URLs, Back/Forward, Calendar/Compare
  keyword preservation, map search/reset, and the text alternative.
- **SC-004**: Go tests/lint, Biome, Node tests, TypeScript, production build, and
  `git diff --check` pass.

## Non-Goals

- Alerts, polling, background monitoring, authentication, or booking.
- Changing upstream messages, colors, work-type choice, or refresh budgets.
- Replacing Leaflet or adding a client data-fetching dependency.
