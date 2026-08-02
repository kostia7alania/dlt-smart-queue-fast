# Comparable History Changes Research

**Date:** 2026-08-02
**Scope:** next product slice after Feature 016; read-only research before
implementation

## Independent audit result

Three bounded subagent audits examined separate evidence sets:

1. The repository/contract audit ranked comparable History changes first,
   because Feature 012 names `full -> available` as a problem while the current
   service and UI summarize each row independently.
2. The UX/data audit found that public copy already says "Check what changed",
   but the page exposes only the latest state, an availability count, and a raw
   table. It recommended a stored change signal using existing observations.
3. The current-market audit found repeated demand for evaluating alternative
   offices when the nearest office has a long wait. It also found contradictory
   community answers about residence, foreigner desks, and walk-in acceptance,
   so that evidence cannot support an any-office eligibility promise.

## Current external evidence boundary

- The official Smart Queue service retains a foreigner registration path using
  a passport or non-Thai identification card:
  https://gecc.dlt.go.th/dltsmartqueue/register
- Thailand's government procedure pages list Bangkok Area Offices 1-5 and
  provincial transport offices as service channels for published licence
  procedures. That is a procedure-level channel statement, not proof that every
  applicant is eligible at every office:
  https://info.go.th/procedure/94e56d1a-d673-4df2-b005-20662d21240d/view
- A 7 June 2024 government report describes a nationwide standard for first
  licences and selecting an office, date, and time in Smart Queue. It does not
  resolve applicant-specific office acceptance:
  https://radiothailand.prd.go.th/th/content/category/detail/id/6/cid/57/iid/295141
- DLT's data catalogue exposes its official procedure inventory, currently
  recording a 30 September 2025 update:
  https://gdcatalog.dlt.go.th/th/dataset/dataset_o9

Fresh 2026 community reports repeatedly compare Bangkok with nearby provinces,
but disagree on walk-in and foreign-applicant procedure. These are demand
signals only, not facts that this product may promise:

- https://www.reddit.com/r/Thailand/comments/1somiia/driving_license_appointment_in_a_different/
- https://www.reddit.com/r/Thailand/comments/1tblb1c/has_anyone_here_renewed_their_drivers_license/
- https://www.reddit.com/r/chiangmai/comments/1uythak/is_it_still_possible_to_walk_in_for_converting/

## Local product evidence

- `apps/web/src/shared/config/site.ts` labels History "Check what changed".
- `apps/web/src/views/availability-evidence-guide/model/availability-evidence.ts`
  asks how stored observations changed.
- `apps/web/src/views/history/ui/history-page.tsx` currently shows observation
  count, latest state, availability count, and isolated newest-first rows.
- `apps/api/internal/service/slot_history.go` summarizes every payload but does
  not compare it with an older observation.
- `dlt_slot_snapshots` already stores observation ID, `current_date_param`, raw
  payload, and fetch time. No new data collection is necessary.

## Decision

Implement comparable stored status changes before another static guide:

- it closes an already published product promise;
- all inputs already exist;
- business semantics can be explicit in Go and OpenAPI;
- it adds no upstream request, route, migration, dependency, or external state;
- it does not depend on disputed office procedure.

The alternative-office decision guide remains a future candidate. It must keep
official procedure channels separate from applicant-specific eligibility and
office confirmation.

## Comparison semantics

History is newest first. Each row compares only with the next older loaded row:

| Condition | Result | Safe meaning |
| --- | --- | --- |
| No older loaded row | `no_baseline` | No baseline exists inside this response window |
| Different `current_date` | `not_comparable` | The request horizon changed |
| Same date and same state | `unchanged` | The summarized state matched at both fetches |
| Same date and different state | `changed` | A different state was observed between the two fetches |

The fetch timestamps bracket an observed change; they do not identify its exact
time. Counts describe only the selected 20, 50, or 100 rows. They are not
monitoring frequency, state duration, probability, or current availability.

## Tooling note

The mandatory modern-web guidance package was attempted before frontend work.
The sandboxed call produced no result, and unsandboxed execution was rejected
as unsafe remote code execution. Implementation therefore follows the local
Next.js 16 accessibility documentation, existing History patterns, native
semantics, and the repository's FSD rules without bypassing that safety block.
