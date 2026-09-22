# Backlog

Updated: 2026-09-22. Ordered by remaining product gaps, not historical feature
numbering. A checked item means its stated outcome was verified. This list
does not authorize external purchases, deployment or account changes. The owner
separately authorized the Feature 020 repository and technical-identity rename.

Features 021 and 023 completed the free-host durability work and the bounded
high-intent procedural review. The full Go/PostgreSQL release checks remain
separate; B07 follows a launch decision for measurement, not infrastructure
completion alone.

## Completed in This Pass

- [x] **B01 / P0: Reconcile the completed product.** Feature
  [019](../specs/019-project-reconciliation/tasks.md): integrate the recovered
  branch, restore full sitemap coverage, update current docs and save the
  validation evidence. Do not recreate already committed map or copy fixes.
- [x] **B14 / P0: Complete the owner-authorized technical rebrand.** Feature
  [020](../specs/020-technical-brand-rebrand/tasks.md): align current source,
  package, container/deploy and documentation identifiers, rename the GitHub
  repository to `thai-driving-license`, and verify CI, redirects and remotes.
- [x] **B02 / P1: Make the static product useful when the API is unavailable.**
  Feature [021](../specs/021-cloudflare-free-mvp/tasks.md): public licence and
  office pages run without the Go API, the office list has a committed fallback,
  and non-migrated BFF endpoints fail explicitly instead of pretending to be live.
- [x] **B05 / P1: Design domain-independent recovery.** The verified fallback is
  `https://thai-driving-license.kostia7alania.workers.dev`; clean build,
  canonical migration, KV reconstruction and recovery commands are documented.
- [x] **B03 / P1: Review high-intent procedural content before launch.** Feature
  [023](../specs/023-procedural-content-review/tasks.md) reviewed
  new/convert/renew, documents, costs, expiry and timing. It adds an explicit
  dated official-source tier, records exact applicant scope and retains the old
  tourist conversion sheet as archival evidence rather than current resident
  policy. The 30-day report fell from 91 claims on 20 pages to 77 claims on 13
  lower-priority pages; those remain visibly dated ongoing maintenance, not
  silently refreshed claims.

## Ready to Specify

- [ ] **B04 / P1: Verify release readiness on the combined revision.** Run
  PostgreSQL integration checks, configured static build, API image and
  desktop/mobile journey smoke. Recheck live DLT behavior with a bounded
  sample. Record revision, environment, failure handling and exact coverage;
  do not refresh every office just to produce a green report.

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
