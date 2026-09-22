# Project Status

Checked: 2026-09-22. This is a repository and delivery audit. Older source
research and validation records retain their original dates.

## September 22 Search and Free-Journey Baseline

Feature 022 connected the exact public `workers.dev` URL-prefix to Google Search
Console using a persistent metadata verification tag. Ownership is verified,
the valid 243-URL production sitemap is submitted, and URL Inspection's live
test reported that the home page is available to Google and can be indexed. The
new property still had no index or traffic history; the sitemap's immediate
initial status was `Couldn't fetch` and must be rechecked after Google processes
the property.

The production audit found that the free release still promoted Calendar,
Compare and History even though their Worker endpoints intentionally return
501 until the Go BFF exists. `NEXT_PUBLIC_SLOT_TOOLS_ENABLED` now gates those
capabilities at build time. The free build removes them from navigation, calls
to action and the sitemap, prevents the map from making a slot request, and
renders a truthful `noindex, follow` boundary on old direct URLs. Licence,
office and map paths remain indexable and hand current slots and booking to the
official DLT service.

Final application commit `59a81ca` passed GitHub CI run
[35709770725](https://github.com/kostia7alania/thai-driving-license/actions/runs/35709770725)
and is deployed as Cloudflare version
`c58ad1bb-4279-402f-82b0-c9f2a19dcec3`. Desktop and 390 x 844 production checks
covered home, office discovery, map, the 218-row Cloudflare snapshot and a
direct unsupported route. The mobile home page had no horizontal overflow.
These are synthetic checks; B07 still needs 10 real user journeys or direct
feedback.

## September 21 Technical Identity Migration

Feature 020 completed the owner-authorized technical rebrand. Source commit
`ba43af2` moved the Go module, frontend package, OpenAPI title, container tags,
future Cloud Run identifiers and current documentation to **Thai Driving
License** / `thai-driving-license`. GitHub CI run
[35600408034](https://github.com/kostia7alania/thai-driving-license/actions/runs/35600408034)
passed all `api`, `web` and `container` jobs on that exact commit.

The public repository is now
[`kostia7alania/thai-driving-license`](https://github.com/kostia7alania/thai-driving-license),
with `main` as the default branch. The local `origin` uses the new URL; the old
GitHub address returns HTTP `301`, and existing pull requests and Actions
history resolve under the new name. No GitLab remote existed in this checkout.

This migration did not verify or create a public production deployment. GitHub
had no configured Cloud Run variables/secrets and no deployment from `main`;
the existing deployment records are historical Render pull-request previews.
Domain ownership and production launch remain open release gates.

## September 21 Free Cloudflare MVP

Feature 021 is complete under the owner's explicit zero-cost release decision.
The indexable deployment is
[`thai-driving-license.kostia7alania.workers.dev`](https://thai-driving-license.kostia7alania.workers.dev),
containing the existing static export and a narrow Worker. The Worker keeps one public DLT
office-list snapshot in KV, refreshes it every six hours, accepts a manual
refresh no more than once per 30 minutes, and falls back to the committed office
capture without calling DLT from the browser.

This does not move slot, history, eligibility or booking logic into Cloudflare.
Those endpoints remain a future Go/PostgreSQL BFF capability and return an
explicit unsupported response in the free edge slice. Application commit
`e851e08` passed GitHub CI run `35607461514` before deployment. Cloudflare
version `a412522d-14e3-4f0c-93ba-f0608c2e083b` uses KV namespace
`8d0e349135304e819bf5dd5da489c5f4` and cron `17 */6 * * *`.

Live checks verified HTTP 200 for the public pages, robots, sitemap and health;
exact-origin self-canonicals; an indexable HTML surface; and `noindex` JSON.
The first production refresh moved KV from the 218-entry committed fallback to
218 live rows, 114 marked open and three changed IDs. An immediate repeat kept
the same capture and returned cooldown. The live mobile UI exposed the stored
source, counts, UTC timestamp and cooldown result.

## September 21 Handoff

The [Mac handoff](HANDOFF.md) is the entry point for the next session. The
available project threads were reconciled against `main` at `9b883fe`; no
additional uncommitted product work was found. After a fresh fetch,
`origin/main` was `a0ed4df`, 53 commits behind local `main`, with no divergence.
Both worktrees were clean, no stash existed, and all local/fetched branch tips
were already contained in `main`. The completed rebrand worktree is preserved.

The handoff records startup, environment and optional data-transfer commands,
and the remaining release sequence: B02, B03, B05, B04, then B06. Git transfers
the code and committed datasets; a local PostgreSQL volume is separate.
Docker was not running, so its contents were not inventoried or backed up.

Current local checks passed: `make test` (cached Go tests, 57 frontend tests, Biome,
TypeScript and data reproducibility) and the configured production build
(255 outputs). Local PostgreSQL integration was skipped and the API image
could not be built locally. There is no new browser, live DLT or production
verification. The source-age report now
lists the same 20 pages and 91 reported claims at 51 days, using a 30-day
threshold. No content review dates were advanced.

GitHub preflight confirmed a public repository with default branch `main`, no
open PRs and no Actions runs before the handoff push. The push then completed
at `ed341a7`, and GitHub's `main` SHA matched the clean local checkout.
[CI run 35590836091](https://github.com/kostia7alania/thai-driving-license/actions/runs/35590836091)
passed all three jobs: Go tests with PostgreSQL 18 and golangci-lint, frontend
checks/build, and the API container build. Those remote checks supplement the
local results above; B04 still needs browser and live-upstream verification.
The follow-up commit only records these results. The following recovery and
detailed export records describe September 11, not a new live release.

## Where the Project Stands

The licence product is implemented and its free office-directory MVP is
publicly deployed. It combines 20 journey/process pages, eight area hubs, 206
office detail pages and the office map. Calendar, Compare and History remain in
the codebase behind the full-BFF capability flag. Remaining work for the
broader product is procedural source review, full Go/PostgreSQL release
verification and a deliberate measurement plan. A personalized checklist is
not implemented; the domain-independent fallback host now is.

The current identity is **Thai Driving License**. `Thai Queue Scout` is the
earlier identity; `Get Thai License` was a later research suggestion. The
recorded domain choice is `thai-driving-license.com`, but ownership and a
current production deployment have not been verified in this audit.

## September 11 Recovery and Integration

At the start of this audit, after `git fetch origin`:

| Ref | Commit | State |
| --- | --- | --- |
| `origin/main` | `a0ed4df` | Last default-branch commit dated 2026-07-19 |
| Local `main` | `e2fef14` | 22 commits ahead of `origin/main`, clean |
| `feat/016-unified-chrome` | `be97d8f` | 30 commits beyond local main; identical to its remote, clean |

Local `main` was a direct ancestor of the recovered branch. A local
fast-forward integrated all 30 commits on 2026-09-11, bringing it to `be97d8f`
before the reconciliation fixes. No push or deployment was performed. The
linked `dtl-parser-015` worktree and its branch are preserved.

Recovered work was not lost:

- In the task **"Найди и выполни задачи проекта"**, the seven-office geocode
  correction was initially left uncommitted, then saved as `41a31bb` on the
  next turn. Both `41a31bb` and the stored Map overlay `03b32ad` are in main.
- In **"Ночной исследовательский спринт"**, interim copy changes were described
  as uncommitted, but the final rebrand included them and the office index.
  The completed branch ended at `be97d8f`; integration into main was the
  outstanding step.

The recovery fixes restore the availability evidence guide omitted from the
rebrand's sitemap. Coverage checks now compare the table with public static
page files, licence journeys and generated office pages, rather than only
checking whether listed URLs exist.

## What the Data Actually Contains

Computed from the committed directory and content registries:

| Measure | Count | Meaning |
| --- | ---: | --- |
| Captured office entries | 218 | Historical upstream list, not a fresh live census |
| Named offices | 212 | Original names are preserved |
| Geocoded offices | 210 | 59 office, 88 district, 63 province anchors |
| Office detail pages | 206 | Named entries with an eligible coordinate |
| Area hubs | 8 | Bangkok, Chiang Mai, Pattaya, Phuket, Koh Samui, Krabi, Hua Hin, Udon Thani |
| Licence/process pages | 20 | Eight licence journeys and twelve process pages |
| Content statements | 295 | 95 proven, 109 official-only, 91 reported |

The directory was generated on 2026-07-31 from committed inputs; regenerating
it does not reread DLT. Its 115 `app_open=1` entries are captured appointment
flags, not proof of current office opening or applicant eligibility.

All 20 journey pages carry `updatedOn: 2026-08-01`. On 2026-09-11:

- The existing 180-day content report finds nothing due.
- A stricter 30-day pre-launch report lists all 20 pages and 91 reported claims,
  each 41 days past the recorded read/review date.

This indicates review work, not proven incorrect content. Official-only and
proven claims are not included in the reported-claim age counter and still
need appropriate review. No source date was advanced during this audit.

## Implementation and Operations

The frontend is a static Next.js export. In the free release it uses same-origin
Worker endpoints for the office list; the Worker stores one validated snapshot
in KV and falls back to the committed capture. There is no runtime Next.js BFF.
The Go API still owns work types, slots, comparison and history semantics, while
PostgreSQL owns durable observations when that full BFF is deployed.

Cloudflare Workers Static Assets plus KV is the active first-release shape.
Cloud Run and PostgreSQL remain the full-BFF path. Container, CI, OIDC and
maintenance files are retained. The GitHub repository is public. Search Console
is now configured; no client analytics, custom DNS or paid domain is configured.

## Requirements Recovered from Later Discussion

The August 6 discussion added a durable-core requirement: licence guidance
should remain useful if the paid domain or live backend disappears. That
requirement belongs in the product and backlog.

That discussion also proposed Worker/D1, a provider subdomain, a GitHub mirror,
release snapshots, and `Get Thai License`. Feature 021 adopts only the provider
subdomain and a narrow Worker/KV office cache. D1, another brand and replacement
of the Go/PostgreSQL core remain unaccepted proposals.

## Verification

Baseline checks on 2026-09-11:

- `make test` passed on original main: Go tests, Biome, 19 Node tests and
  TypeScript.
- The recovered branch passed its 55 existing Node tests and `data:check`.
- PostgreSQL integration tests were skipped because `TEST_DATABASE_URL` was
  not set. The recovered branch does not change the Go API.
- Installed runtimes were Node 26.7.0 and Go 1.26.4.

Final combined checks passed: 57 Node tests, dataset reproducibility, Biome,
TypeScript and a configured production build generating 255 static outputs.
The export audit checked 246 sitemap URLs against their HTML and canonicals,
6,221 internal links, redirect destinations and main landmarks with no errors.
It found no outgoing brand in exported HTML. All 242 static content pages in
the sitemap have one H1; four interactive routes render their headings after
hydration and were checked separately in source.

[Feature 019 tasks](../specs/019-project-reconciliation/tasks.md) records the
commands and scope. Browser hydration, live upstream behavior, database
integration, Docker image and public deployment were not revalidated in this
close-out. Historical browser results in Feature 016 remain historical.

## Next Work

Use [BACKLOG.md](BACKLOG.md). Reconciliation is complete; next specify the static
experience under API failure, procedural source review and domain-independent
recovery. Release verification precedes an explicitly authorized public launch.
