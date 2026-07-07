# Tasks: Calendar and Office UX

**Input**: Design documents from `specs/003-calendar-office-ux/`

**Prerequisites**: `plan.md`, `spec.md`

## Phase 1: Setup

- [x] T201 Create `/calendar` page skeleton with state for office, keyword, work type, slots, holidays, and data-source metadata in `apps/web/src/app/calendar/page.tsx`
- [x] T202 Implement live-first snapshot-fallback fetch helper reporting `source` and `fetched_at`
- [x] T203 Link `/calendar` from the home page

## Phase 2: User Story 1 - Calendar view (P1)

- [x] T204 [US1] Build month grid rendering slot days with upstream `color`/`message` verbatim; absent days neutral
- [x] T205 [US1] Month navigation across the returned date range
- [x] T206 [US1] Day selection shows rounds (`round`, `count`, `MaxCount`) verbatim
- [x] T207 [US1] Holiday overlay when holidays load; skip silently when unavailable

## Phase 3: User Story 2 - Office list (P2)

- [x] T208 [US2] Office list with client-side name search, preserved names, selected state
- [x] T209 [US2] Office selection re-resolves work types (groupId 4 + keyword) and reloads the calendar
- [x] T210 [US2] Readable empty-state when no work types resolve for the office/keyword

## Phase 4: User Story 3 - Filters (P3)

- [x] T211 [US3] New/Renew keyword toggle re-resolving work types
- [x] T212 [US3] "Available only" toggle dimming `เต็ม` days

## Phase 5: User Story 4 - Snapshot fallback (P4)

- [x] T213 [US4] Fall back to snapshot endpoints for offices/work-types/slots with visible "stored data from <fetched_at>" notice
- [x] T214 [US4] Readable error + retry when both live and snapshot fail

## Final Phase: Polish

- [x] T215 Run `npm --prefix apps/web run lint` and `npm --prefix apps/web run build`
- [x] T216 Validate the browser flow (calendar renders office 47 defaults; filters work; fallback notice appears when live fails)
- [x] T217 Update `docs/TASK_INDEX.md` and checkboxes here

## Notes

- No new npm dependencies (FR-007).
- Preserve upstream strings exactly (FR-008).
- No backend changes in this feature.
