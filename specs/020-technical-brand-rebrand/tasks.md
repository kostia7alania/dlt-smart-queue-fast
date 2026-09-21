# Feature 020 Tasks

- [x] T2001 Verify the clean base, remote, target slug availability and existing deployment state.
- [x] T2002 Define the active migration boundary and preserve upstream/historical evidence.
- [x] T2003 Rename current Go module/imports, package, OpenAPI and container/deploy identifiers.
- [x] T2004 Update current repository, security, handoff, status and governance documentation.
- [x] T2005 Run local frontend, data, build, source and diff checks.
- [ ] T2006 Commit and push the migration revision to `main`.
- [ ] T2007 Verify GitHub CI for the migration revision.
- [ ] T2008 Rename the GitHub repository, update `origin`, and verify the resulting remote state.
- [ ] T2009 Close Feature 020 with exact validation evidence and remaining limits.

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
