# Feature 016: Availability Evidence Guide

**Status:** Complete (validated 2026-08-02)
**Created:** 2026-08-02

## Goal

Give every Thai Queue Scout visitor one durable, product-owned explanation of
what the displayed source, freshness, availability status, and map precision do
and do not prove. The guide should make Calendar, Compare, Map, and History safer
to interpret without inventing office procedure or implying that an observation
is a reservation.

## Research Basis

- Current search results for DLT appointments are dominated by commercial
  procedure pages and contradictory community reports about appointment and
  walk-in behaviour. They do not establish a stable office procedure.
- The official Smart Queue surface exposes a foreigner entry, but booking and
  eligibility remain official DLT concerns.
- The repository already has precise contracts for live and stored responses,
  five map statuses, three coordinate-precision levels, and tool-specific fetch
  behaviour. Those facts are safer and more useful than another speculative
  procedural guide.
- Existing public copy says data is live or stored, but the definitions are
  distributed across four tools and their feature specifications.

## User Stories

### P1 — Interpret source and freshness

As a visitor, I can distinguish a response obtained during the current action
from a stored observation and understand that neither reserves a time.

### P1 — Interpret every status honestly

As a visitor, I can read `available`, `full`, `no_slots`, `not_offered`, and
`unknown` without turning missing or old evidence into an office-level claim.

### P1 — Continue with the right tool

As a visitor, I can see which views fetch live data, may fall back to stored
data, or read PostgreSQL only, then continue to Calendar, Compare, Map, History,
or the official DLT service.

### P2 — Understand map precision

As a visitor, I can distinguish an office-level point from district and
province fallbacks, so an approximate anchor is not mistaken for a front door.

### P2 — Reach help in context

As a visitor already using a discovery view, I can open the guide directly
without losing the product's read-only boundary.

## Functional Requirements

1. `/guides/how-to-read-dlt-availability` MUST be a static Server Component
   with no client state, runtime fetch, form, tracking, or new dependency.
2. The page MUST define `live` as data received during the current user action
   and `stored` as a previously successful PostgreSQL observation with visible
   freshness when the consuming view has it.
3. The page MUST say explicitly that a displayed observation is not a held,
   reserved, guaranteed, or completed appointment.
4. The page MUST define the five map states from the existing Go contract:
   `available`, `full`, `no_slots`, `not_offered`, and `unknown`.
5. The `available` and `full` definitions MUST preserve the exact upstream full
   marker `เต็ม`; a day is counted as available only when its exact message is
   different.
6. `no_slots` MUST mean that the stored slot payload has no days on or after the
   selected current date. It MUST NOT be described as office closure.
7. `not_offered` MUST mean that the latest complete stored work-type lookup for
   the selected option is empty. It MUST NOT be described as an eligibility
   ruling.
8. `unknown` MUST mean that a work type is known but no usable stored slot
   payload exists. It MUST NOT be described as unavailable.
9. The page MUST explain office, district, and province coordinate precision
   from the committed geodata legend and state that fallbacks are not door-level
   directions.
10. The page MUST include a semantic tool-behaviour table covering Calendar,
    Compare, Map, and History, including each tool's live/stored behaviour.
11. The page MUST include an ordered evidence-reading workflow: check source,
    check time, interpret status, inspect alternatives, and confirm with DLT.
12. The guide MUST link to all four discovery tools, the Bangkok office hub,
    the bounded foreigner guide, and the official DLT Smart Queue.
13. Calendar, Compare, Map, and History MUST each expose a contextual link to
    the guide; public navigation and at least one public journey page MUST also
    expose it.
14. The route MUST have unique metadata, a self-canonical URL, visible Article
    JSON-LD, and sitemap coverage.
15. JSON-LD MUST be derived only from visible build-time content and serialized
    with the existing opening-angle-bracket escape.
16. The view MUST follow existing FSD imports, public APIs, BEM hooks, shadcn
    primitives, and the `tw:` Tailwind prefix.
17. Regression tests MUST protect route uniqueness, exact status keys, source
    labels, precision values, tool behaviours, and unsafe-claim guardrails.
18. Documentation MUST record the evidence boundary, validation result, and
    absence of deployment or remote mutation.

## Claim Boundary

### Safe product facts

- How this repository obtains, stores, summarizes, and labels observations.
- Exact status predicates implemented by the Go service.
- Exact committed coordinate-precision legend.
- Which product tools do or do not call the upstream DLT service.
- The official hand-off boundary.

### Unsafe or variable claims

- Whether an office accepts walk-ins, foreigners, or a particular document set.
- Whether a displayed day can still be booked or held.
- Office opening state, quality, language support, eligibility, or service time.
- A prediction that availability will return or persist.

## Non-Goals

- Changing backend status logic, upstream requests, persistence, or API models.
- Booking, login, alerts, monitoring, polling, analytics, payments, or forms.
- New office pages, rankings, procedural checklists, or document advice.
- Refactoring the four discovery views or unifying their client state.
- Deployment, domain registration, push, or any external account mutation.

## Success Criteria

- The static guide exposes all definitions and tool boundaries in visible,
  semantic, non-color-only content.
- Contextual links make the guide reachable from each discovery view and the
  public journey.
- Tests fail if the guide drifts from the five status keys, three precision
  levels, source meanings, or read-only hand-off.
- Go tests, Node tests, Biome, TypeScript, golangci-lint, production build,
  exported-HTML checks, and desktop/mobile browser smoke pass.
- The feature closes through one reviewed local commit with no push or deploy.
