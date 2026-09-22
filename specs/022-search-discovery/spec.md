# Feature 022: Search Discovery Baseline

**Status:** Complete
**Created:** 2026-09-22

## Problem

The public `workers.dev` release is crawlable, but Google Search Console is not
connected and the first visitor journey has not been checked end to end from a
new user's point of view. Without that baseline, search visibility and product
changes would be driven by assumptions rather than observed failures.

## Scope

1. Verify the exact production URL-prefix in Google Search Console using a
   persistent public verification meta tag.
2. Submit the existing production sitemap and inspect the key landing URL.
3. Exercise representative desktop and mobile journeys through the public site:
   landing page, licence path, office discovery, available tool states and the
   official DLT hand-off.
4. Fix only high-impact blockers or misleading states found in that audit.
5. Record exact deployment, Search Console and journey evidence without
   treating synthetic checks as real user feedback.

## Non-goals

- Installing behavioural analytics, cookies or a consent banner before a
  concrete measurement need is identified.
- Claiming ranking, indexing or traffic before Search Console reports it.
- Treating a click to DLT as a completed appointment or licence.
- Rebuilding unsupported slot, compare or history APIs in the static Worker.
- Closing B07's requirement to review 10 real user journeys with simulated use.

## Acceptance

- Search Console reports verified ownership for
  `https://thai-driving-license.kostia7alania.workers.dev/`.
- The production sitemap is submitted and its initial Search Console status is
  recorded truthfully.
- The verification tag survives a clean configured static build.
- At least one desktop and one mobile journey are checked on the deployed site,
  including an unsupported-tool state and the official hand-off boundary.
- Any shipped UX change is based on an observed blocker, passes the existing web
  checks and is verified on the exact deployed revision.
