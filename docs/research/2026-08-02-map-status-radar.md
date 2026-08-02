# Map Status Radar Research

**Date:** 2026-08-02

## Question

After comparable History changes, what is the smallest safe product increment
that helps people investigate another DLT office without inventing eligibility
or procedure rules?

## Independent research streams

Three read-only subagents examined separate evidence:

1. **Official office-choice evidence.** Smart Queue lets a foreign user choose
   a transaction, office, date, and time. Specific New and Renew government
   procedure pages list Bangkok Area Offices 1-5 and provincial offices, but
   requirements differ by procedure and expiry band. These sources do not prove
   that every office accepts every foreign applicant or completes the visit the
   same day.
2. **Repository UX.** Compare, Map, Calendar, History, Appointments, and the
   evidence guide already establish the alternative-office path. Some links can
   preserve more context, but another general guide would duplicate existing
   content.
3. **Market/product signal.** Current community reports repeatedly compare long
   waits with nearer-term slots in other provinces, while answers conflict on
   residence, walk-ins, and acceptance. This supports better alternative
   discovery, not new policy claims.

## Primary sources

- DLT/PRD foreign Smart Queue flow, published 15 October 2024:
  https://radionan.prd.go.th/th/content/category/detail/id/9/iid/332028
- Government temporary-licence procedure and service channels:
  https://info.go.th/procedure/94e56d1b-16d8-4cb1-8a33-b96d928658f1/view
- Government renewal procedure, valid or expired up to one year:
  https://info.go.th/procedure/94e56d1a-d673-4df2-b005-20662d21240d/view
- Renewal expired one to three years:
  https://info.go.th/procedure/94e56d1a-d2e3-4250-ad7a-263c2601b3ee/view
- Renewal expired more than three years:
  https://info.go.th/procedure/94e56d1a-cf99-4fc9-ad59-b069953a7525/view
- DLT procedure catalogue: 198 procedures, data through September 2025,
  including service channels, conditions, documents, fees, and hotline 1584:
  https://gdcatalog.dlt.go.th/th/dataset/dataset_o9
- DLT/PRD foreign renewal handoff, published 6 December 2023:
  https://radiothailand.prd.go.th/th/content/category/detail/id/57/iid/238901

## Candidate ranking

| Candidate | Incremental utility | Claim safety | Implementation risk | Decision |
| --- | --- | --- | --- | --- |
| Map five-status radar | High | High | Low | Build now |
| Context-preserving discovery links | Medium | High | Low | Keep as next small UX option |
| Alternative-office guide | Low-medium | Medium | Low | Defer; existing pages overlap |
| Procedure source cards | Medium | Medium | Medium | Defer until mapped per exact procedure |

The Map already retrieves and displays five stored statuses, counts them, and
passes one visible office list to both Leaflet and a semantic text alternative.
Its only status control is `available=1`. A multi-status radar therefore adds
real control without adding a claim, request, endpoint, or data source.

## Safe product contract

- Filter only existing last-known statuses.
- Keep counts based on the search result before status filtering.
- Filter marker and text output from the same list.
- Preserve `available=1`; canonicalize new interaction into `statuses`.
- Treat absent overlay entries and overlay failure as `unknown`.
- Say stored/snapshot-only and keep source/freshness interpretation links.
- Do not rank offices or imply nearest, best, eligible, accepting walk-ins, or
  currently available.

## Modern web and architecture note

The modern-web guidance package was unavailable in the offline npm cache. No
unsandboxed remote package was executed. The implementation uses the installed
Base UI button, native fieldset semantics, `aria-pressed`, URL source of truth,
the local Next.js accessibility guide, and a page-local FSD model.

## Validation boundary

The user explicitly requested no tests. Feature 018 therefore uses no test
suite and adds no test file. TypeScript, targeted Biome, production build,
manual URL/source inspection, and diff/task-count audits remain the bounded
delivery gate.
