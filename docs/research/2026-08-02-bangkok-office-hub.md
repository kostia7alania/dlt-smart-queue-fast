# Bangkok DLT Office Hub Research

**Date:** 2026-08-02
**Scope:** first city-level discovery page after the public launch-trust work
**Evidence policy:** committed DLT fixtures define office identity; committed
derived geodata defines labelled map anchors; commercial and community search
results identify user uncertainty but never establish operational policy.

## Decision

Ship `/offices/bangkok` as an evidence-rich directory for the five Bangkok Area
Land Transport Offices. The page should preserve exact site IDs and source names,
disclose district-level coordinate precision, and deep-link into Calendar,
Compare, Map, and History.

Do not ship a “best Bangkok DLT office” ranking or a procedural guide. The
current evidence cannot support durable claims about opening state, walk-ins,
foreigner eligibility, documents, language support, service quality, or current
slot availability.

## Committed Product Evidence

The repository's `docs/assets/1-get-dlt-offices.json` fixture contains:

| Site ID | Preserved English source name |
| ---: | --- |
| 1 | Area Land Transport Office 1 (Bang Khun Thian) |
| 2 | Area Land Transport Office 2 (Taling Chan) |
| 3 | Area Land Transport Office 3 (Phra Khanong) |
| 4 | Area Land Transport Office 4 (Nong Chok) |
| 5 | Area Land Transport Office 5 (Chatuchak) |

The fixture also contains `app_open`, but that mutable snapshot field is not a
safe static-page claim and is deliberately excluded from the directory model.

`apps/web/src/entities/dlt/data/office-geo.json` contains all five site IDs with
Thai search names, coordinates, matched place strings, and `district` precision.
It was generated on `2026-07-19T20:44:43.051Z` through Nominatim search and
retains OpenStreetMap attribution. These values are useful area anchors, not
verified entrances or navigation instructions.

## Current External Signal

### Official entry and upstream availability

Search still exposed the [official Smart Queue foreigner entry](https://gecc.dlt.go.th/dltsmartqueue/DocumentaryForeigner)
on 2026-08-02. It remains the appropriate final booking destination, not proof
of office-specific procedure.

A bounded request to the previously observed office endpoint
`https://app-gecc.theassistech.co.th/dlt-api1/getSite/2` received no bytes and
timed out after 20 seconds. This single observation is not treated as a DLT
outage. It is a reason to keep the public directory build-time-controlled and
route changing operational facts through source-labelled live/stored tools.

### Search landscape

Search results for Bangkok DLT offices currently lead with commercial office
directories and rankings, including a [Bangkok DLT office directory](https://tdl-service.com/dlt-offices/bangkok)
and a [“best office” article](https://tdl-service.com/blog/best-dlt-office-bangkok).
They confirm demand for office selection, but commercial rankings are not a
source for this product's factual claims.

Recent community posts discuss [appointments in another province](https://www.reddit.com/r/Thailand/comments/1somiia/driving_license_appointment_in_a_different/)
and [new-licence questions in Bangkok](https://www.reddit.com/r/Bangkok/comments/1t0gzr6/new_thai_driver_license_question/).
Their varying anecdotes are useful evidence of uncertainty, not stable rules.

## Claim Boundary

### Safe on the static directory

- exact committed site IDs and English names;
- Thai geocoding search names and matched places, with their derived status;
- coordinate values, generation time, OpenStreetMap attribution, and explicit
  district-level precision;
- local deep links that carry exact site IDs into source-aware product tools;
- the statement that current state must be rechecked.

### Unsafe without current authoritative evidence

- current `app_open`, opening hours, or live appointment availability;
- walk-in acceptance or whether an appointment is mandatory;
- foreigner eligibility, accepted visa class, residency proof, or documents;
- language support, queues, wait time, service quality, or a “best” office;
- an implication that a district coordinate is a front-door pin.

## Implementation Consequences

1. Use one static Server Component and no client state or live build-time fetch.
2. Protect exact IDs, names, geography, and query links with focused tests.
3. Build the visible directory and `ItemList` JSON-LD from the same model.
4. Place provenance and limits next to the office list, not only in a footer.
5. Add internal links from public navigation, Home, and Appointments.
6. Keep the slice in `views/bangkok-offices`; reuse existing public chrome and
   shared primitives instead of adding a speculative entity or feature.

Implementation and validation are tracked in `specs/015-bangkok-office-hub/`.
