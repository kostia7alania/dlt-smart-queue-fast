# Feature 014: Launch Trust and Official Hand-off

**Status:** Complete
**Created:** 2026-07-31

## Goal

Turn the technically complete discovery application into a trustworthy public
entry point for English-speaking foreigners who need to find a workable Thai
DLT appointment, while keeping every claim bounded by what the product and the
official Smart Queue entry point can actually prove.

## Research Basis

- The official Smart Queue web application remains available at
  `https://gecc.dlt.go.th/dltsmartqueue/` and includes a foreigner entry point,
  but it is a JavaScript-only booking flow.
- Current third-party guides and recent community reports agree that appointment
  friction is real, but disagree about walk-ins and office-specific procedure.
- The application can prove office coverage, observed availability, source, and
  freshness. It cannot prove acceptance rules, booking success, document
  requirements, or whether a slot remains available after the user leaves.
- The existing home page exposes strong tools but reads like a developer
  utility and does not yet state the independence, privacy, or hand-off contract.

## User Stories

### P1 — Understand the product immediately

As a foreign applicant, I can understand within one screen that the service
helps me find and compare DLT appointment availability without booking for me.

### P1 — Make a safe next move

As a user who found a promising office or date, I can continue to the official
DLT Smart Queue while seeing that availability may change and final booking is
outside this service.

### P2 — Evaluate the service before using it

As a privacy-conscious visitor, I can see that discovery is read-only, needs no
DLT credentials, distinguishes live from stored data, and does not imply DLT
affiliation.

### P2 — Reach the right tool from search

As a visitor landing on appointment or foreigner-guide content, I can get a
concise evidence-bounded explanation and continue into Calendar, Compare, Map,
or the official service without encountering unsupported procedural advice.

## Functional Requirements

1. The home page MUST lead with the appointment-discovery outcome, not API
   mechanics.
2. The primary action MUST open the local Calendar; Compare MUST remain the
   main alternative action.
3. Calendar, Compare, Map, and History MUST each have a concise capability
   description and direct internal link.
4. Public launch pages MUST state that the product is independent, read-only,
   does not book appointments, and does not collect DLT credentials.
5. The official hand-off MUST use the centralized HTTPS Smart Queue URL, open
   safely, and explain that availability can change before booking.
6. `/appointments` MUST be a static, indexable product-intent page that routes
   visitors to the existing discovery tools.
7. `/guides/dlt-smart-queue-for-foreigners` MUST explain how this product fits
   around the official flow without presenting variable office rules as fact.
8. New routes MUST have unique metadata, self-canonical URLs, internal links,
   and sitemap entries.
9. Structured data MUST contain only visible, build-time-controlled claims and
   MUST escape opening angle brackets before rendering.
10. All new UI MUST follow the existing FSD layers, shadcn/Base UI components,
    `tw:` Tailwind prefix, and static-export constraints.
11. The launch surface MUST add no analytics, cookies, forms, user identifiers,
    third-party scripts, or new dependencies.

## Non-Goals

- Domain registration, deployment, Search Console, analytics, or cloud-account
  changes.
- Authentication, alerts, waitlists, payment, booking automation, or credential
  collection.
- A complete licence-process, legal, document, walk-in, or office-policy guide.
- Claims of official affiliation, guaranteed appointments, guaranteed accuracy,
  or bypassing the official queue.
- Thai localization before a maintained fluent translation workflow exists.

## Success Criteria

- A first-time visitor can identify what the product does, its limits, and the
  next action from the rendered home page.
- `/appointments` and the foreigner guide are present in the static export and
  sitemap with correct canonicals.
- The official DLT destination is centralized and every external hand-off is
  labelled and protected with `rel="noopener noreferrer"`.
- Focused content/config regression tests, Biome, Node tests, TypeScript, and a
  production static build pass.
- Feature documentation and the task index record validation evidence; changes
  are committed locally without a push or external mutation.
