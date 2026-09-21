# Continue on another Mac

Prepared: 2026-09-21. Resume from `main` in
[thai-driving-license](https://github.com/kostia7alania/thai-driving-license).
The free Cloudflare application release is `e851e08`; later documentation-only
commits record its verified production state.

## Current state

Thai Driving License is implemented. Feature 021 is complete and the public
zero-cost Worker deployment is live at
`https://thai-driving-license.kostia7alania.workers.dev`.
The product includes 20 licence/process pages, eight area hubs, 206 office
pages, Calendar, Compare, Map and History. The office dataset has 218 captured
entries. These are historical observations, not a fresh office census.

Keep the current static Next.js UI and the Go/PostgreSQL full-BFF path. The free
first release adds only a same-origin Cloudflare office snapshot. The intended user
journey is licence question -> preparation -> office -> appointment evidence
-> official DLT hand-off. No accounts, payments or automated booking are needed
for this release. Stored availability does not establish eligibility or reserve
an appointment.

## Earlier discussions reconciled

Reviewed the locally available project threads and archived development
sessions, then checked their outcomes against the Git graph and current files.

| Discussion | Durable outcome | State in this checkout |
| --- | --- | --- |
| July 19-24, map repair and production preparation | Geocode fix `41a31bb`, stored map/history, shareable tools, API hardening, CI and deployment runbook | Included in `main` |
| July 31-August 2, research and discovery work | Trust pages, Bangkok hub, evidence guide, comparable history, map status radar `e2fef14` | Included in `main` |
| August 2, full licence-product rebrand | Thai Driving License, licence cluster, office pages, common navigation; completed branch `be97d8f` | Included in `main` |
| August 6, survival without paid infrastructure | Static guidance must remain useful if the domain or API disappears | Feature 021 adopts a `workers.dev` fallback plus Worker/KV office snapshot; D1 and another brand remain out of scope |
| August 20, `dtl-parser-015` cleanup discussion | Preserve the linked worktree until its commits are integrated | Integration completed September 11; worktree remains intact |
| September 11, final reconciliation | Recovered branch integrated, sitemap coverage repaired, docs reconciled in `9b883fe` | Complete; do not repeat old merge or repair tasks |

After fetching on September 21, `origin/main` was still `a0ed4df` and local
`main` was 53 commits ahead with no divergence. Both worktrees were clean,
there were no stashes, and no local or fetched remote branch had commits outside
`main`. The old `feat/016-unified-chrome` branch is already an ancestor of
`main`; it is not the branch to resume. No worktree was removed.

The new handoff commit and the preceding application commits belong on
`origin/main`. On the receiving Mac, check the fetched revision instead of
relying on the old ahead count. Local history from unconnected machines was
not inspected.

Push completed at `ed341a76cc3c13837b306f4e63fb8d5f4c2a91c3`; GitHub's
`main` SHA matched the clean local checkout. The follow-up documentation commit
records the successful CI result below and leaves the application unchanged.

## Start on the receiving Mac

For a fresh checkout, run this from the parent directory where the project
should live:

```bash
git clone --branch main https://github.com/kostia7alania/thai-driving-license.git thai-driving-license
cd thai-driving-license
git status --short --branch
git log -1 --oneline
git merge-base --is-ancestor 9b883fe HEAD
```

The last command must succeed and this file must exist. If a checkout already
exists, inspect `git status`, `git worktree list`, the current branch and
`git fetch origin` first. Only fast-forward a clean `main` that is an ancestor
of `origin/main`; preserve divergent or uncommitted work separately.

Read `AGENTS.md`, [TASK_INDEX.md](TASK_INDEX.md), this handoff and
[BACKLOG.md](BACKLOG.md). Feature 020 closed the owner-authorized technical
identity migration. Feature 021 is complete; choose the next ready backlog item
before changing product behavior.

Prerequisites: Node 26 from `.nvmrc`, Go 1.26+, Docker with Compose running,
and golangci-lint v2 for the full lint gate. The sending Mac used Node 26.7.0
and Go 1.26.4. Install the existing lockfile dependencies with `make web-install`.

Use a dedicated local database on port 5433 to avoid another project's 5432:

```bash
make web-install
POSTGRES_PORT=5433 make up
```

API terminal, from the repository root:

```bash
DATABASE_URL='postgres://myuser:mypassword@localhost:5433/mydb?sslmode=disable' \
DATABASE_REQUIRED=true make api-dev
```

Web terminal, also from the repository root:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080 make web-dev
```

Check `http://localhost:3000/licence`, `/offices/all`, `/calendar`, `/compare`,
`/map` and `/history`. The API exposes `http://localhost:8080/docs`, `/healthz`
and `/readyz`. `DATABASE_REQUIRED=true` prevents a database connection failure
from silently becoming an in-memory development session.

The root `.env.example` documents all variables. Docker Compose reads root
`.env`; Go's `make api-dev` does not load it. Pass overrides through the shell.
Next.js reads `apps/web/.env.local` or shell variables, and expects
`NEXT_PUBLIC_API_URL`. An old ignored local example using `API_URL` is not part
of Git and must not be copied as the current contract. Public frontend values
are embedded during the build. Keep `DLT_WORKFILTER_TOKEN` server-side if a
fresh upstream check establishes that it is needed.

## What Git transfers

Source, specifications, research, migrations, lockfiles and committed office
datasets transfer through the repository. Install dependencies and rebuild on
the receiving Mac; copying `node_modules`, `.next` or `out` is unnecessary.

Local environment files and PostgreSQL history do not transfer through Git.
No root `.env` or web `.env.local` was present at the handoff check. Docker was
not running, so local database contents could not be inventoried or exported.
The existing database volume and linked worktree were left untouched. A fresh
database is sufficient for development but starts without old observations.

If old local history is needed, start Docker on the sending Mac, verify the
Compose project/database, then export outside the repository:

```bash
docker compose exec -T postgres pg_dump -U myuser -d mydb -Fc > "$HOME/thai-driving-license-history.dump"
shasum -a 256 "$HOME/thai-driving-license-history.dump"
```

Transfer that archive privately, compare its checksum on the receiving Mac,
and restore only into the new empty development database:

```bash
docker compose exec -T postgres pg_restore --exit-on-error --no-owner \
  -U myuser -d mydb < "$HOME/thai-driving-license-history.dump"
```

Restore before starting the API, then let startup apply any missing migrations.
These export/restore steps were documented, not executed in this handoff.

## Remaining broader-product release sequence

Feature 021 closed B02 and B05 for the free office-directory release: the live
site runs without the Go API, has a committed fallback, a verified recovery
address and exact canonical/rebuild documentation.

1. **B03, source review.** Re-read procedural sources for all pages that will
   be published, starting with new/convert/renew, documents, fees, expiry and
   timing. Record applicant scope, source and actual review date. The
   September 21 report flags 20 pages and 91 reported claims at the 30-day
   threshold, now 51 days old. It does not prove they are wrong, and excludes
   official-only/proven claims from its claim counter.
2. **B04, full-BFF release verification.** Run the commands below on the final revision,
   check mobile/desktop journeys and one bounded live DLT sample, and record
   actual API failure behavior. Resolve current office/work IDs before slot
   queries. Do not bulk-refresh all offices to test the release.
3. **B06, broader product launch.** Use [DEPLOYMENT.md](DEPLOYMENT.md), with concrete hosting,
   API, database and domain configuration agreed before external deployment.
   Record deployed SHA and URLs, CORS, health/readiness, backup restore and
   spending limits. Then B07 covers measurement and the first ten user journeys.

B08-B13 are later work: checklist, more office-specific detail, alerts, a
backend rewrite, shared UI registry and PWA packaging. None is required to
resume the current release. Do not reopen completed rebrand work or inflate
the day's scope with another infrastructure migration.

Release checks, from the repository root after PostgreSQL is running:

```bash
TEST_DATABASE_URL='postgres://myuser:mypassword@localhost:5433/mydb?sslmode=disable' make test
make lint
NEXT_PUBLIC_SITE_URL=https://thai-driving-license.kostia7alania.workers.dev make web-build
make worker-check
make api-image
git diff --check
```

The example site URL above checks configured metadata locally; use the
verified canonical origin and `NEXT_PUBLIC_API_URL` for an actual deployment.
The integration suite uses an isolated temporary schema in the test database.

## Validation at this handoff

- `make test`: passed. Go packages passed from cache; all 57 frontend tests,
  Biome (132 files), TypeScript and the 218-entry data check passed.
- Configured production build: passed, 255 generated outputs. The first
  attempt was blocked by local process/port restrictions; the permitted rerun
  succeeded. No application change was needed.
- Local PostgreSQL integration: skipped because `TEST_DATABASE_URL` was unset.
  An uncached `go test -count=1 -v ./internal/repo` confirmed that skip and
  passed the migration loader tests. Docker was unavailable locally.
- Documentation/export checks: 38 local Markdown links, 13 shell examples
  parsed with `bash -n`, all 246 sitemap targets present in exported HTML,
  environment ignore rules and `git diff --check` passed.
- GitHub preflight: public repository, default branch `main`, no open PRs and
  no Actions runs returned before the push. The checked-in API deployment
  workflow is manual-only; a Git push is not proof of a production deployment.
- No fresh browser pass, live DLT check, procedural source reread, provider
  configuration, domain check or public deployment was performed.

After the push, [CI run 35590836091](https://github.com/kostia7alania/thai-driving-license/actions/runs/35590836091)
passed on `ed341a7`: `api` ran Go tests with `TEST_DATABASE_URL` against
PostgreSQL 18 and golangci-lint; `web` installed from the lockfile and passed
lint, tests, TypeScript, data check and build; `container` built the API image
without publishing it. This closes the local database/image verification gap
for that source revision. Browser journeys, fresh DLT checks, recovery and
actual deployment were later completed for the narrow Feature 021 edge release.
Procedural source review and full Go/PostgreSQL release checks remain.

Feature 021 production evidence: application commit `e851e08` passed GitHub CI
run `35607461514`; Worker version `a412522d-14e3-4f0c-93ba-f0608c2e083b`
serves the exact-origin canonical, robots, sitemap, health and office snapshot.
The live refresh stored 218 entries, 114 marked open, and a repeated browser
refresh returned the expected 30-minute cooldown.

See [PROJECT_STATUS.md](PROJECT_STATUS.md) for the earlier complete export
audit and [BACKLOG.md](BACKLOG.md) for the durable release checklist. A green
source build alone does not close the release gates above.
