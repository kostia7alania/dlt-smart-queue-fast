# Implementation Plan: Calendar and Office UX

**Branch**: `003-calendar-ux` | **Date**: 2026-07-07 | **Spec**: `specs/003-calendar-office-ux/spec.md`

## Summary

Frontend-only feature: a new `/calendar` page in the Next.js app composes the existing
feature 001 live endpoints and feature 002 snapshot endpoints into an office picker,
work-option filters, and a hand-rolled month calendar colored by upstream slot
statuses. No backend changes, no new npm dependencies.

## Technical Context

**Language**: TypeScript, Next.js App Router client component

**Data sources** (all existing):
- `GET /v1/dlt/offices` + fallback `GET /v1/dlt/snapshots/offices`
- `GET /v1/dlt/work-types?siteId&groupId=4&keyword` + fallback `GET /v1/dlt/snapshots/work-types?...`
- `GET /v1/dlt/work-types/{id}/slots?currentDate=<today>` + fallback `GET /v1/dlt/snapshots/slots?workTypeId=...`
- `GET /v1/dlt/work-types/{id}/holidays` (no snapshot fallback; overlay is optional)

**Key facts informing the design** (validated against live data during 002):
- Slots responses cover ~6 months of bookable days only; missing dates = not bookable.
- Statuses observed: `เต็ม`/#FF0000, `ว่าง`/#25862F, `ไม่มีคนจอง`/#25862F.
- Upstream colors come with the payload — the calendar uses them directly instead of
  hardcoding a palette (FR-008 friendly and robust to new statuses).

## Key Decisions

1. **Hand-rolled calendar grid.** A month grid is ~50 lines with Tailwind; a calendar
   library would violate MVP simplicity for no gain.
2. **Live-first, snapshot-fallback fetch helper.** One `fetchWithFallback(liveUrl,
   snapshotUrl, extract)` helper tries live, then the snapshot endpoint, and reports
   `source: "live" | "snapshot"` plus `fetched_at` for the freshness notice.
3. **Defaults preselected** (office 47, keyword ` NEW THAI`, groupId 4) so the page
   shows value immediately (SC-001); every default is changeable.
4. **Day details inline, not a modal.** Selecting a day shows its rounds under the
   calendar — simplest accessible presentation.
5. **`/calendar` is a separate page.** The playground stays the raw JSON debug tool;
   the calendar is the first product-shaped surface. Home page links to both.

## Constitution Check

- **MVP Simplicity**: Pass — UI only, no deps, no backend surface change.
- **Go Backend / Thin UI**: Pass — UI composes existing JSON endpoints.
- **OpenAPI-First**: Pass — no API changes.
- **Preserve External DLT Contract**: Pass — statuses/colors/counts rendered verbatim;
  UI copy only adds labels around them.
- **Repo-Owned AI Context**: Pass — this directory + TASK_INDEX update.
- **Verifiable Incremental Delivery**: Pass — each user story is independently
  demonstrable in the browser; lint/build gate the slice.

## Structure

```text
apps/web/src/app/calendar/page.tsx   # the feature (client component)
apps/web/src/app/page.tsx            # add link to /calendar
```

## Risks

- Upstream slot windows may differ per work type (only one observed) — the calendar
  renders whatever dates arrive, so unknown windows degrade gracefully.
- Live upstream currently unstable (observed outage) — mitigated by design (US4).
