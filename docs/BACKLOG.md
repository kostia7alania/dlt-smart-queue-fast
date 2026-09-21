# Backlog

Updated: 2026-09-21. Ordered by remaining product gaps, not historical feature
numbering. A checked item means its stated outcome was verified. This list
does not authorize external purchases, deployment or account changes. The owner
separately authorized the Feature 020 repository and technical-identity rename.

For the next working session, follow [the MVP handoff](HANDOFF.md): B02, B03
and B05, then B04 against the release revision, then B06. B07 follows launch;
B08-B13 are not prerequisites. Feature 021 is the next available number after
the explicitly reprioritized Feature 020 technical-identity migration.

## Completed in This Pass

- [x] **B01 / P0: Reconcile the completed product.** Feature
  [019](../specs/019-project-reconciliation/tasks.md): integrate the recovered
  branch, restore full sitemap coverage, update current docs and save the
  validation evidence. Do not recreate already committed map or copy fixes.
- [x] **B14 / P0: Complete the owner-authorized technical rebrand.** Feature
  [020](../specs/020-technical-brand-rebrand/tasks.md): align current source,
  package, container/deploy and documentation identifiers, rename the GitHub
  repository to `thai-driving-license`, and verify CI, redirects and remotes.

## Ready to Specify

- [ ] **B02 / P1: Make the static product useful when the API is unavailable.**
  Define and check the content-only experience for licence pages, offices and
  official links. Discovery tools must distinguish unavailable live data from
  dated observations. A static availability snapshot is a separate decision,
  not an existing fallback. Done when the journey can be followed with the Go
  API stopped and the limitations are visible.
- [ ] **B03 / P1: Review procedural content before launch.** Start with
  new/convert/renew, documents, costs, expiry and timing. Record exact source,
  procedure, applicant scope and read date; retain uncertainty where sources
  conflict. The 2026-09-21 report finds 20 pages and 91 reported claims at least
  30 days old (51 days since the recorded review). The default 180-day report
  finds none due; this is a proposed pre-launch review threshold, not a claim
  that the content is wrong.
- [ ] **B04 / P1: Verify release readiness on the combined revision.** Run
  PostgreSQL integration checks, configured static build, API image and
  desktop/mobile journey smoke. Recheck live DLT behavior with a bounded
  sample. Record revision, environment, failure handling and exact coverage;
  do not refresh every office just to produce a green report.
- [ ] **B05 / P1: Design domain-independent recovery.** Select a fallback host,
  document canonical/indexing behavior, export and recovery commands, and how
  a user finds the fallback address if the paid domain expires. Verify a clean
  rebuild from committed sources. `pages.dev`, a GitHub mirror and release
  archives are candidates, not provisioned infrastructure or guaranteed uptime.

## Launch and Product Evidence

- [ ] **B06 / P1: Launch the reviewed revision.** Depends on B02-B05 and explicit
  authorization for the concrete resources. Recheck recorded domain
  candidates, configure the chosen host/API/database, CORS, backups, restore,
  health/readiness and cost limits. Done only with working URLs and a recorded
  deployed revision, not merely checked-in workflows.
- [ ] **B07 / P1: Measure the first real journeys.** After launch, use a
  dedicated Search Console/measurement setup and user feedback. Follow
  landing page -> licence journey -> office/tool -> useful result -> official
  hand-off. A hand-off click is not proof of a completed booking or licence.
  Review 10 initial user journeys before prioritizing more content or alerts.
- [ ] **B08 / P2: Printable preparation checklist.** Use existing sourced
  journey content, visible dates and official-only boundaries. Done when a
  downloaded/printed copy remains useful without API access, with no passport
  uploads, accounts or invented eligibility logic. Promote after identifying
  the most useful initial journey through B07 or direct user feedback.
- [ ] **B09 / P2: Improve office-specific usefulness.** Only add procedure,
  language or document details with office-specific sources and a review owner.
  Nearby coordinates and appointment flags are insufficient evidence. Choose
  the first office from user/query demand instead of generating more city pages.

## Conditional Work

- [ ] **B10: Bounded watchlists/alerts.** Validate demand, channel preference,
  collection cost and acceptable freshness first. Requires an explicit MVP
  scope/constitution update before adding monitoring or payment. Start with
  a limited period and clear coverage; no reservation or automatic booking.
- [ ] **B11: Lower-cost backend evaluation.** A Worker/D1 spike was proposed in
  August research. Before implementation, compare it with the actual Go/API/DB
  operating cost and preserve current API, fallback and history contracts.
  Do not rewrite Go/PostgreSQL based on old free-tier estimates.
- [ ] **B12: Shared UI tokens/registry.** Start only when another project consumes
  the same components, as specified in [ADR-001](adr/ADR-001-ui-kit-strategy.md).
- [ ] **B13: PWA/native packaging.** Start from a demonstrated installation or
  offline requirement; static pages alone do not prove offline support.

## Already Resolved or Not Actionable

- Map geocode corrections were committed as `41a31bb` and are included in main.
- Context-preserving discovery links, shared chrome, eight hubs, office detail
  pages and licence content already exist. Do not reopen them as new features.
- Historical 015/016 number collisions are documented using full spec names.
  Renumbering every directory is unnecessary.
- A vehicle dropdown cannot change results under the observed `workfilter`
  contract. Revisit only with a verified vehicle discriminator.
- Repository, Go module and deployment-template names were deliberately kept
  stable until the owner explicitly requested a complete technical migration;
  that authorized migration is tracked in Feature 020.
- Domain registration, public outreach, analytics installation and deployment
  are separate external actions, not routine backlog cleanup.
