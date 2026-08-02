# Availability Evidence Guide Research

**Date:** 2026-08-02
**Outcome:** Build one product-owned interpretation guide; do not publish another
office-procedure or “best office” page.

## Question

After the launch trust pages and Bangkok office hub, what public slice can add
real user value without inventing DLT procedure, adding live upstream load, or
crossing into booking and monitoring?

## Current external landscape

- The official [DLT Smart Queue](https://gecc.dlt.go.th/dltsmartqueue/main)
  search surface exposes a “Login For Foreigner” entry. Identity, eligibility,
  and appointment completion therefore remain an official-service hand-off.
- Current commercial results include changing procedural advice and office
  selection claims, for example an [appointment booking guide](https://tdl-service.com/thai-driving-license/dlt-appointment-booking)
  and a [Bangkok office comparison](https://tdl-service.com/blog/best-dlt-office-bangkok).
  They are useful evidence of search intent, not authoritative evidence for this
  product's claims.
- Recent community threads continue to ask whether a different province can be
  selected, whether renewals or conversions can be handled as walk-ins, and how
  to avoid paid intermediaries: [different province](https://www.reddit.com/r/Thailand/comments/1somiia/driving_license_appointment_in_a_different/),
  [renewal experience](https://www.reddit.com/r/Thailand/comments/1tblb1c/has_anyone_here_renewed_their_license/),
  [conversion walk-in](https://www.reddit.com/r/chiangmai/comments/1uythak/is_it_still_possible_to_walk_in_for_converting/),
  and [appointment without paid services](https://www.reddit.com/r/ThailandTourism/comments/1sbv0z3/how_to_get_dlt_appointment_without_paid_services/).
  These anecdotes vary by office, time, and applicant and do not support a
  durable walk-in or document promise.

The durable gap is interpretation. Search and community results discuss how to
obtain an appointment, while Thai Queue Scout already exposes several kinds of
evidence without one central explanation of their limits.

## Local contract evidence

### Source and freshness

- Calendar attempts live work-type and slot requests, then labels PostgreSQL
  fallback data and its fetch time.
- Compare checks 1–8 offices sequentially. It reuses snapshots at most ten
  minutes old, then attempts live data and can fall back per office.
- Map availability is snapshot-only. Opening or filtering it does not call the
  DLT upstream.
- History rows are PostgreSQL-only. The separate work-type resolution used to
  select a history stream still follows the normal live-with-stored-fallback
  client.

Source files:

- `apps/api/internal/service/compare.go`
- `apps/api/internal/service/map_availability.go`
- `apps/api/internal/service/slot_history.go`
- `apps/web/src/views/calendar/ui/calendar-page.tsx`
- `apps/web/src/views/history/ui/history-page.tsx`

### Status predicates

The backend's exact full marker is `เต็ม`. A scoped day is counted as available
only when its exact message differs.

- `available`: at least one scoped day is not `เต็ม`.
- `full`: scoped days exist and all are `เต็ม`.
- `no_slots`: no scoped days exist; Map scopes days to those on or after the
  request's `currentDate`.
- `not_offered`: the latest complete stored work-type lookup is empty.
- `unknown`: a work type is known, but no usable stored slot payload exists.

Map exposes all five. History summarizes stored slot rows with the first three.
None is a reservation, eligibility decision, opening-state claim, or prediction.

### Coordinate precision

The committed `office-geo.json` legend defines:

- `office`: exact office POI;
- `district`: district-level fallback;
- `province`: province-centroid fallback.

District and province points are orientation anchors, not front-door directions.

## Product decision

Add `/guides/how-to-read-dlt-availability` as a static Server Component with:

1. visible live/stored definitions;
2. a five-status safe/unsafe conclusion ledger;
3. a semantic Calendar/Compare/Map/History behaviour table;
4. coordinate-precision definitions;
5. a five-step reading workflow and official DLT hand-off;
6. contextual links from all discovery views and the public journey.

This adds no upstream calls, client state, dependency, identity collection,
tracking, form, database change, booking, alert, or external account mutation.

## Web implementation evidence

Installed Next.js 16 documentation supports static Server Components for shared
public content, static metadata in a Server Component, native JSON-LD script
markup with escaped opening angle brackets, and build-time prerendering.

The required `modern-web-guidance` search was attempted first. The package was
not available in the local npm cache, and network installation was unavailable
in the restricted environment. The implementation therefore uses installed
Next.js documentation and existing project patterns without a new dependency or
unsafe download workaround.

## Rejected alternatives

- **More office SEO pages:** too thin until each page has new stable evidence.
- **Best-office ranking:** quality, travel, and procedure evidence is incomplete.
- **Walk-in or document guide:** current sources are variable and contradictory.
- **Alerts or monitoring:** still outside the MVP constitution and require user,
  delivery, credential, and background-work decisions.
- **Live map refresh:** risks unbounded upstream fan-out and weakens the existing
  snapshot-only contract.
