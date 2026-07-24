# Feature 013 Tasks

- [x] T1301 Define the production architecture, explicit non-goals, defaults, and rollback path.
- [x] T1302 Add typed environment configuration for Cloud Run port, required persistence, CORS, and pool bounds.
- [x] T1303 Cover configuration defaults, overrides, and invalid values with unit tests.
- [x] T1304 Split process liveness from PostgreSQL-backed readiness.
- [x] T1305 Add bounded HTTP timeouts, SIGINT/SIGTERM shutdown, and PostgreSQL pool cleanup.
- [x] T1306 Replace wildcard development CORS with configured-origin GET/OPTIONS middleware and tests.
- [x] T1307 Bound simultaneous external DLT calls per API instance.
- [x] T1308 Test DLT concurrency limiting and cancellation while waiting for capacity.
- [x] T1309 Deduplicate identical slot observations within a six-hour heartbeat window.
- [x] T1310 Add configurable pruning for fetch logs and expired raw slot observations.
- [x] T1311 Add and test a one-shot database maintenance command.
- [x] T1312 Serialize concurrent migrations with a transaction-scoped PostgreSQL advisory lock.
- [x] T1313 Add a reproducible non-root multi-stage API Docker build and ignore file.
- [x] T1314 Enable and validate the Next.js static export for every public route.
- [x] T1315 Add Cloudflare Pages security/cache headers without a Pages Function.
- [x] T1316 Add CI for Go, PostgreSQL integration, web, static build, and container build.
- [x] T1317 Add an OIDC-based Cloud Run deployment workflow gated by production configuration.
- [x] T1318 Add weekly dependency update configuration for Go, npm, Docker, and Actions.
- [x] T1319 Add the project open-source license and third-party attribution notice.
- [x] T1320 Add evidence-based contributor and private security-reporting guides.
- [x] T1321 Replace starter README copy with the real product, architecture, and verified commands.
- [x] T1322 Document production deployment, secrets, backup, maintenance, monitoring, rollback, and cost guards.
- [x] T1323 Align environment examples and Makefile commands with the production contract.
- [x] T1324 Run all relevant checks, record evidence, close feature docs, and create logical local commits.

## Validation

Validated on 2026-07-24:

- `go test ./...`: all API packages passed, including runtime, CORS,
  readiness, graceful-shutdown, maintenance, deduplication, migration, and DLT
  concurrency coverage.
- `TEST_DATABASE_URL=postgres://myuser:mypassword@localhost:5433/mydb?sslmode=disable go test ./internal/repo -count=1`:
  the complete PostgreSQL repository integration suite passed against
  PostgreSQL 18.
- `/Users/kostiabazrov/go/bin/golangci-lint run`: `0 issues`.
- `npm run lint`: Biome checked 61 files with no issues.
- `npm test`: all 6 frontend/tooling tests passed.
- `npm run typecheck`: TypeScript completed without errors.
- A Node 26 production build with a configured canonical origin and public site
  name passed. Next statically generated `/`, `/calendar`, `/compare`,
  `/history`, `/map`, `/playground`, `/robots.txt`, and `/sitemap.xml`.
- Exported HTML inspection confirmed a self-canonical home and calendar page,
  `WebSite` JSON-LD, configurable site-name metadata, `noindex` on the
  playground, and no playground entry in the sitemap.
- `docker build -t dlt-smart-queue-api:local -f apps/api/Dockerfile .` passed.
  Image inspection confirmed `nonroot:nonroot`, `/app/api`, and an 8,013,404
  byte image.
- `go run github.com/rhysd/actionlint/cmd/actionlint@v1.7.7` passed for the
  checked-in workflows.
- `git diff --check` passed.

The initial sandbox-only Go and Next checks could not bind their local test/
build ports; the same commands passed when rerun with local-port permission.
No cloud account, domain, repository visibility, or remote branch was mutated.
