# Feature 023: Procedural Content Review

**Status:** Complete
**Created:** 2026-09-22

## Problem

The public guide labels appointment evidence and third-party reports, but it
cannot distinguish an official DLT publication from either of those categories.
Its highest-intent procedural pages were last reviewed on 2026-08-01 and still
describe the official English DLT pages as unreadable, even though current
search access exposes first-licence and renewal guidance.

That gap can make a dated commercial guide look equivalent to current official
guidance, or leave an official answer under the weaker "only DLT can confirm"
label.

## Scope

1. Re-read the official and attributed sources for the first licence, renewal
   and foreign-licence conversion journeys.
2. Review the shared document, fee, expiry and timing claims used by those
   journeys.
3. Add one explicit `official` evidence kind whose claims always carry the exact
   publisher, source URL and access date.
4. Promote only statements supported by a source actually read on 2026-09-22;
   retain office-specific decisions and unresolved conflicts as such.
5. Record the source reachability change and the remaining gaps in repository
   research notes.

## Non-goals

- Treating search snippets, proposed regulations or third-party guides as law.
- Generalizing Thai-language citizen procedures to every foreign applicant.
- Claiming that fully online renewal is available without a current launch
  announcement or an exercised official flow.
- Re-reviewing all 20 procedural pages in one change.
- Changing appointment, office, Cloudflare or backend behaviour.

## Acceptance

- Official claims are visually and textually distinct from project observations,
  DLT-only decisions and third-party reports.
- Every official claim includes a visible source link and the actual access date.
- The first-licence and renewal pages accurately reflect the current official
  English DLT guidance without hiding applicant scope or page age.
- The conversion page keeps unsupported or conflicting details attributed and
  does not imply that an old tourist-conversion document is current policy.
- The shared documents and fee pages use official figures only where the source
  scope is exact; office-specific acceptance remains a DLT decision.
- Content-review reporting includes dated official claims as well as dated
  third-party claims.
- Focused lint, typecheck, content-review tests and a configured static build
  pass before delivery.
