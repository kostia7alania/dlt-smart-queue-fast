# Roadmap

Updated: 2026-09-22. [BACKLOG.md](BACKLOG.md) owns executable priorities;
[PROJECT_STATUS.md](PROJECT_STATUS.md) owns current evidence and delivery state.

## Implemented

| Stage | Result | Specifications |
| --- | --- | --- |
| Read-only discovery | DLT API, OpenAPI, playground and Calendar | 001, 003 |
| Persistence | Complete list snapshots, fallback and per-collection freshness | 002, 007 |
| Platform | Repository toolchain, shadcn, FSD and prefixed Tailwind | 004, 005, 006 |
| Office comparison | Geocoded Map, bounded Compare, stored availability and URL state | 008, 009, 010, 011 |
| Stored history | Observations and comparable status transitions | 012, 017 |
| Delivery foundation | Static export, container, CI, OIDC template, retention and open-source documents | 013 |
| Public trust | Landing pages, independence and official hand-off | 014 |
| Office and process content | Bangkok hub, eight area hubs and sourced guides | 015-bangkok-office-hub, 015-local-hubs-guides |
| Unified licence product | Shared chrome, 20 journey/process pages, 206 office pages, index and brand assets | 016-unified-chrome, 016-license-authority-rebrand |
| Evidence interpretation | Availability guide and five-status Map radar | 016-availability-evidence-guide, 018 |
| Free public MVP | Cloudflare static Worker/KV office snapshot, free canonical and manual refresh | 021 |
| Search and content trust | Search Console baseline, truthful capability gates and high-intent official-source review | 022, 023 |

The parallel content/rebrand work was integrated into local `main` on
2026-09-11. "Implemented" refers to repository code, not a verified public
deployment. Older feature numbers collide, so use the full directory names
when opening a specification.

## Latest Completed Work

Feature 023 added a dated official-guidance evidence tier and reviewed the
first-licence, renewal, conversion, document, fee, expiry and timing journeys.
Feature 022 previously connected Search Console and aligned the public free
surface with the capabilities actually deployed.

## Next: Durable Core and Launch Readiness

- Run the B04 Go/PostgreSQL, API image, configured build, browser and bounded
  live-DLT verification on the combined revision.
- Keep the 77 older dated claims on 13 lower-priority pages in the content
  maintenance queue without treating age alone as proof they are wrong.
- Prepare a reproducible full-BFF release candidate only if the current free
  MVP produces a concrete need for those capabilities.
- Collect first-user feedback and search/conversion evidence.

## After Evidence

- Add a printable checklist or more guided preparation where users get stuck.
- Expand area/procedure content only where it answers measured demand with
  maintainable sources.
- Evaluate optional bounded alerts only after demand and running cost are known.

## Deferred

Shared themes and a private component registry wait for a second consuming
project. PWA/native wrappers wait for a concrete offline/mobile need. Vehicle
filtering waits for an upstream discriminator. Booking, auth, billing and
background monitoring remain out of scope. Worker/D1 migration and other
government-service products remain research proposals.
