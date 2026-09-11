# Feature 019 Tasks

- [x] T1901 Locate the earlier tasks and trace uncommitted edits to their final commits.
- [x] T1902 Fetch and verify both worktrees, ancestry, remote refs and stash state.
- [x] T1903 Fast-forward the completed rebrand into local main.
- [x] T1904 Restore the missing guide and verify sitemap coverage against source content.
- [x] T1905 Update current product, status, roadmap and backlog documents.
- [x] T1906 Correct startup/deployment docs and stale historical completion headings.
- [x] T1907 Run relevant checks and record results with their limitations.
- [x] T1908 Close this feature and commit the verified changes locally.

## Validation

Validated on 2026-09-11:

- Pre-integration `make test`: Go tests, Biome, 19 Node tests and TypeScript
  passed. PostgreSQL integration tests skipped with `TEST_DATABASE_URL` unset.
- Combined frontend: `npm test` passed 57 tests; `npm run data:check` confirmed
  the 218-entry directory matches its committed inputs; `npm run lint` checked
  132 files; `npm run typecheck` passed.
- `NEXT_PUBLIC_SITE_URL=https://thai-driving-license.com
  NEXT_PUBLIC_SITE_NAME='Thai Driving License' npm run build` passed on Node
  26.7.0 and Next.js 16.2.10, producing 255 static outputs. The build needed
  local process/port access for Turbopack. No runtime API was started.
- Export audit: 249 HTML files, 246 sitemap URLs, correct self-canonicals,
  no indexed `noindex` pages, valid redirect destinations, 6,221 internal links
  with no missing targets, one main landmark per sitemap page, and no outgoing
  brand in HTML. The four query-driven tools render their H1 after hydration;
  their source headings were checked, not counted as static content headings.
- Local Markdown link validation and `git diff --check` passed.
- The sitemap checks now detect missing public pages and mismatches between
  generated office/journey routes and their data, including IDs that no longer
  qualify for an office page.

Limits: no fresh browser hydration/visual pass, live DLT query, PostgreSQL
integration run, Go lint, Docker build, domain/analytics verification or deploy.
No API, migration, dependency or procedural-content change was introduced.

## Files Changed in the Reconciliation Commit

- `apps/web/src/shared/config/static-routes.ts`
- `apps/web/src/shared/config/static-routes.test.mts`
- `README.md`, `apps/web/README.md`
- `docs/PROJECT_STATUS.md`, `docs/BACKLOG.md`, `docs/TASK_INDEX.md`
- `docs/PRODUCT_SPEC.md`, `docs/ROADMAP.md`, `docs/DEPLOYMENT.md`
- `docs/EVALS.md`, `docs/AI_FIRST_WORKFLOW.md`, `docs/idea.md`
- `specs/015-local-hubs-guides/spec.md`
- `specs/016-license-authority-rebrand/spec.md`, `tasks.md`
- `specs/019-project-reconciliation/spec.md`, `plan.md`, `tasks.md`

The earlier 100-file rebrand diff was integrated by fast-forward and retains
its original commits; it is not duplicated in this reconciliation commit.
