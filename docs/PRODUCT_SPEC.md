# Product Spec

Updated: 2026-09-22. Implementation and validation state: [PROJECT_STATUS.md](PROJECT_STATUS.md).

## Product and Audience

Thai Driving License helps a foreigner in Thailand understand their licence
journey, prepare the next step, compare possible offices, and continue to the
official DLT service. Appointment discovery is part of a broader licence guide.

The implemented brand is **Thai Driving License**. The first canonical is the
free assigned `workers.dev` origin. `thai-driving-license.com` remains an
optional later custom domain, not a requirement or confirmation of ownership.
See [the rebrand spec](../specs/016-license-authority-rebrand/spec.md) and
[Feature 021](../specs/021-cloudflare-free-mvp/spec.md).

The later `Get Thai License` / `getthailicense.com` suggestion was research.
No subsequent accepted rename is recorded in the repository.

## User Journey

1. Choose the relevant situation: first licence, renewal, conversion,
   motorcycle, international permit, replacement, expiry or five-year licence.
2. Read the relevant process and document pages with their sources and dates.
3. Explore an area or individual office, understanding the captured data and
   coordinate precision.
4. Use Calendar or Compare to inspect appointment evidence. Use Map and History
   to interpret stored observations.
5. Confirm eligibility and procedure with DLT, and book through the official
   service where applicable.

The current "start here" experience is a static decision table. It is not a
personalized eligibility engine or a completed offline checklist.

## Implemented Capabilities

| Capability | Current behavior |
| --- | --- |
| Licence content | `/licence` and 20 journey/process pages with typed claim categories |
| Offices | Eight area hubs, `/offices/all`, 206 office detail pages, plus a fresh-or-committed Cloudflare office snapshot |
| Calendar | Office and exact New/Renew work-option selection, work types, holidays and returned days; visible stored fallback |
| Compare | One to eight offices, sequential fetching, recent snapshot reuse, per-office failures and earliest observed date |
| Map | Search and five stored-status filters, shared URL state, coordinate precision and a text alternative |
| History | Bounded stored observations; status changes compared only across matching request dates |
| Trust | Shared navigation, independence/freshness notices, evidence guide and official hand-off |
| Developer surface | JSON/OpenAPI Go API, `/playground`, migrations, tests and deployment templates |

There is no periodic slot collection: Map coverage and History depend on
previously stored Go/PostgreSQL lookups. Feature 021 periodically refreshes only
the public office list. Empty work types, no slots, unknown state and full
calendars must remain distinct. Vehicle types can be inspected through the API,
but the observed `workfilter` contract does not support a meaningful vehicle
filter.

## Evidence Rules

- Preserve source strings and identifiers exactly.
- `proven` content is limited to what appointment data actually establishes.
- `official` content names the government publisher, exact source URL and the
  date it was actually read; it stays scoped to the applicant category on the
  source page.
- `official-only` identifies a decision or detail that DLT must confirm.
- `reported` content retains attribution and its source-read date.
- A stored status, `app_open`, office name or nearby coordinate does not prove
  eligibility, walk-in acceptance, current opening hours or appointment capacity.
- History compares status transitions, not every payload change, precise release
  times or the probability of getting an appointment.
- Update source-read dates only after checking the source. A successful build
  or dataset regeneration is not a fresh upstream observation.

## Durability Requirement

The core guide and office information should stay useful if a future paid domain
expires or the full Go API stops. Static content builds without an API, the
`workers.dev` host is domain-independent, and the committed directory is the
runtime office fallback. A portable downloadable checklist and static slot
availability remain backlog work. Do not promise automatic failover or offline
availability before implementing and checking them.

## Business Model

The current product is free and open source. Optional time-bounded watchlists
or alerts remain a monetization hypothesis. Measure demand and collection cost
before expanding scope; no payment flow or monitoring service is implemented.

## Architecture and Non-goals

The free release uses a Next.js static export plus one Cloudflare Worker/KV
office snapshot behind same-origin `/v1` routes. The full stack remains Go with
chi/Huma and PostgreSQL with pgx and plain SQL for work types, slots and history.
There is no running Next.js BFF in the exported site.

No auth, booking automation, billing, Redis, queues, D1 or slot monitoring. The
only scheduled task is the bounded office-list refresh authorized in Feature
021. A framework or durable-datastore rewrite is not part of the current plan.

See [BACKLOG.md](BACKLOG.md) for priorities and [idea.md](idea.md) for the
historical upstream contract evidence.
