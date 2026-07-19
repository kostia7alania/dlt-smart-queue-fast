# Feature Specification: Cross-Office Availability Comparison

**Feature Branch**: `009-availability-comparison`

**Created**: 2026-07-19

**Status**: Complete (validated 2026-07-19)

**Input**: Backlog item 1 — the core "compare offices" product value (Roadmap
Phase 3 leftover). Needs multi-office slot fetching within upstream-politeness
limits.

## Problem

Today the calendar shows one office at a time. A user choosing where to book
(e.g. anywhere reachable from Chiang Mai, or along a route) has to click through
offices one by one. The product's core promise (docs/idea.md: даты, свободные
места, ближайший слот, удобство по маршруту) needs a side-by-side comparison:
"which of these offices has the earliest available day?"

## Politeness Design (the heart of this feature)

Comparing N offices costs up to 2 upstream calls per office (workfilter →
siteroundopen). An unbounded or parallel fan-out could hammer the DLT API, whose
rate-limit behavior is unknown (docs/idea.md open questions). Constraints chosen:

- **Bounded batch**: 1–8 offices per compare request; more returns HTTP 400.
  Eight offices ≈ 16 upstream calls worst case — comparable to a user clicking
  through offices manually.
- **Sequential, never parallel**: offices are fetched one at a time with a
  300 ms pause between offices that hit the live upstream.
- **Snapshot reuse window**: if the store already has a work-types or slot
  snapshot for the exact lookup fetched within the last 10 minutes, it is served
  from PostgreSQL and the upstream is not called at all. Repeated comparisons
  (tweaking the office set, sharing links) cost ~0 upstream calls.
- **Live-failure circuit**: once one office's live call fails, the remaining
  offices in that request skip the upstream entirely and serve whatever
  snapshots exist (any age). One outage never causes 16 sequential timeouts.
- **Per-office isolation**: one office failing (no data live or stored) yields
  an `error` entry for that office; the rest of the comparison still renders.

## User Scenarios

### User Story 1 - Compare selected offices (Priority: P1)

As a user picking where to book, I select several offices and one work option
(NEW/RENEW) and see, per office, the earliest available day and how many days
are available, sorted so the best office is on top.

**Acceptance Scenarios**:

1. `/compare` lets me pick up to 8 offices (search + checkboxes) and a work
   option, then run the comparison with one button.
2. Each result row shows: office name (upstream string unchanged), resolved work
   type, first available date with the upstream day message/color, available-day
   count vs total bookable days, data source (live or stored + freshness), and
   an "Open calendar" link to `/calendar?siteId=`.
3. Rows are sorted by earliest available date; offices with no availability or
   no data sink to the bottom with an honest status.
4. Availability means the upstream day message is not `เต็ม` (the upstream
   "full" marker, preserved exactly).

### User Story 2 - Shareable comparison (Priority: P2)

As a returning user, I want my office set in the URL so I can bookmark or share
the comparison.

**Acceptance Scenarios**:

1. Running a comparison puts `?siteIds=1,2,3&keyword=...` in the URL.
2. Opening `/compare?siteIds=1,2,3` preselects those offices and runs the
   comparison automatically.

## Requirements

- **FR-001**: New endpoint `GET /v1/dlt/compare` (OpenAPI-documented): query
  params `siteIds` (CSV, 1–8 entries, positive ints, deduplicated), `keyword`
  (required, exact upstream string incl. leading space), optional `groupId`
  (default 4) and `currentDate` (default: server's today, `YYYY-MM-DD`).
- **FR-002**: The comparison summary (first available day, counts) is computed
  in Go; the frontend never re-derives it. Day messages/colors pass through
  unchanged.
- **FR-003**: Sequential fetching, 8-office cap, 300 ms inter-office pause,
  10-minute snapshot reuse window, live-failure circuit, per-office error
  isolation — as specified above.
- **FR-004**: Live fetches inside a comparison go through the existing service
  paths so fetch logging (`dlt_fetches`) and snapshot persistence keep working
  unchanged.
- **FR-005**: `/compare` page follows FSD (`views/compare` →
  `widgets/office-compare` + `features/office-multi-select` → `entities/dlt`),
  BEM hooks, `tw:` Tailwind prefix, unique route title, and is cross-linked
  from home, calendar, and map pages.
- **FR-006**: Works without a database (live-only mode): snapshot reuse and
  fallbacks are skipped, live fetching still compares.

## Success Criteria

- **SC-001**: Go unit tests cover: summary math (เต็ม vs available), the
  snapshot reuse window (fresh snapshot → no upstream call), the live-failure
  circuit (one failure → later offices skip upstream), per-office error
  isolation, and request validation (cap, bad IDs, missing keyword).
- **SC-002**: golangci-lint, Biome, tsc, and production builds (Go + Node 26)
  stay green.
- **SC-003**: Browser smoke: select offices → compare renders sorted rows;
  deep link `/compare?siteIds=...` auto-runs; calendar links land on the right
  office.

## Non-Goals

- Availability coloring for all ~210 offices on the map (needs a background
  refresh budget; the 8-office cap here is the polite ceiling for on-demand).
- Vehicle-type filter (backlog item 2), notifications/monitoring (constitution
  non-goal), route/distance ranking.
