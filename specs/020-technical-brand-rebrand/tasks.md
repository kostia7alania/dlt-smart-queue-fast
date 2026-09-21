# Feature 020 Tasks

- [x] T2001 Verify the clean base, remote, target slug availability and existing deployment state.
- [x] T2002 Define the active migration boundary and preserve upstream/historical evidence.
- [x] T2003 Rename current Go module/imports, package, OpenAPI and container/deploy identifiers.
- [x] T2004 Update current repository, security, handoff, status and governance documentation.
- [x] T2005 Run local frontend, data, build, source and diff checks.
- [x] T2006 Commit and push the migration revision to `main`.
- [x] T2007 Verify GitHub CI for the migration revision.
- [x] T2008 Rename the GitHub repository, update `origin`, and verify the resulting remote state.
- [x] T2009 Close Feature 020 with exact validation evidence and remaining limits.

## Validation

Local validation on 2026-09-21:

- `npm ci` installed the existing lockfile without changing dependencies. npm
  reported 14 audit findings in that existing graph (4 moderate, 9 high,
  1 critical); dependency remediation is outside this identity-only change.
- `npm run test`: 57 tests passed.
- `npm run data:check`: the committed 218-entry directory is current.
- `npm run lint`: Biome checked 132 files with no fixes.
- `npm run typecheck`: passed.
- Configured `npm run build`: passed outside the restricted sandbox, producing
  all 255 static outputs. The first sandboxed attempt failed only because
  Turbopack was denied a loopback port.
- `git diff --check`: passed.
- Local Go tests/lint could not run because Go is not installed. The local API
  image build could not run because the Docker daemon is stopped. Both remain
  required in GitHub CI before the repository rename.
- Residual old-name search found only exact upstream DLT language and historical
  validation/baseline records; no current source/config identifier uses the old
  repository, module, package or container name.

Remote validation on 2026-09-21:

- Source migration commit `ba43af208271eb8d3b7702fab69a4176c2d96112`
  was pushed to `main`.
- [GitHub CI run 35600408034](https://github.com/kostia7alania/thai-driving-license/actions/runs/35600408034)
  passed on that exact SHA: `api` passed Go tests against PostgreSQL 18 and
  golangci-lint, `web` passed install/lint/test/typecheck/data/build, and
  `container` built the renamed API image without publishing it.
- GitHub repository is `kostia7alania/thai-driving-license`, public, with
  default branch `main`; local `origin` uses the matching HTTPS URL and both
  local/remote `main` resolved to the migration SHA after fetch.
- The previous GitHub URL returned HTTP `301` to the new repository. All 12
  open pull requests and the CI run resolved under the new repository path.
- Remote inventory contained only the GitHub `origin`; there was no GitLab
  remote or second repository to rename.
- GitHub had no Cloud Run Actions variables/secrets and no deployment from
  `main`. Existing deployment records are historical Render PR previews, so no
  production cloud service was created, renamed or claimed as verified.
