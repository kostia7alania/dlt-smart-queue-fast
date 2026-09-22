# Feature 023 Plan

## Baseline

- `main` and `origin/main` matched at `a6f56b1` on 2026-09-22.
- The free production release publishes 20 procedural pages, with 91 reported
  claims due under the 30-day pre-launch review threshold.
- The content model has `proven`, `official-only` and `reported` kinds only.
- The 2026-07-31 research note says official DLT pages returned a JavaScript
  shell; current search access now exposes readable official English guidance.

## Delivery sequence

1. Capture the exact official pages, applicant scope, publication state and
   access date in a new research note.
2. Extend the typed claim model, shared legend and source rendering with an
   `official` kind, reusing the existing semantic list and badge patterns.
3. Update the first-licence and renewal journeys from the official pages.
4. Reconcile the conversion, documents, fees, expiry and timing claims without
   promoting facts beyond the source scope.
5. Extend the content-review tool to age both official and third-party claims.
6. Run focused checks, inspect the rendered static pages and close the feature
   only if the source links, labels and dates remain visible.

## Evidence boundary

An official page proves only the text and applicant category it publishes. It
does not prove branch-level acceptance, current appointment availability or the
state of an unannounced online service. Search-result extraction is recorded as
the retrieval method when the DLT page itself still returns an empty shell to a
plain reader.
