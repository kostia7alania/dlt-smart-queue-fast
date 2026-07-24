# Feature 013 Tasks

- [ ] T1301 Define the production architecture, explicit non-goals, defaults, and rollback path.
- [ ] T1302 Add typed environment configuration for Cloud Run port, required persistence, CORS, and pool bounds.
- [ ] T1303 Cover configuration defaults, overrides, and invalid values with unit tests.
- [ ] T1304 Split process liveness from PostgreSQL-backed readiness.
- [ ] T1305 Add bounded HTTP timeouts, SIGINT/SIGTERM shutdown, and PostgreSQL pool cleanup.
- [ ] T1306 Replace wildcard development CORS with configured-origin GET/OPTIONS middleware and tests.
- [ ] T1307 Bound simultaneous external DLT calls per API instance.
- [ ] T1308 Test DLT concurrency limiting and cancellation while waiting for capacity.
- [ ] T1309 Deduplicate identical slot observations within a six-hour heartbeat window.
- [ ] T1310 Add configurable pruning for fetch logs and expired raw slot observations.
- [ ] T1311 Add and test a one-shot database maintenance command.
- [ ] T1312 Serialize concurrent migrations with a transaction-scoped PostgreSQL advisory lock.
- [ ] T1313 Add a reproducible non-root multi-stage API Docker build and ignore file.
- [ ] T1314 Enable and validate the Next.js static export for every public route.
- [ ] T1315 Add Cloudflare Pages security/cache headers without a Pages Function.
- [ ] T1316 Add CI for Go, PostgreSQL integration, web, static build, and container build.
- [ ] T1317 Add an OIDC-based Cloud Run deployment workflow gated by production configuration.
- [ ] T1318 Add weekly dependency update configuration for Go, npm, Docker, and Actions.
- [ ] T1319 Add the project open-source license and third-party attribution notice.
- [ ] T1320 Add evidence-based contributor and private security-reporting guides.
- [ ] T1321 Replace starter README copy with the real product, architecture, and verified commands.
- [ ] T1322 Document production deployment, secrets, backup, maintenance, monitoring, rollback, and cost guards.
- [ ] T1323 Align environment examples and Makefile commands with the production contract.
- [ ] T1324 Run all relevant checks, record evidence, close feature docs, and create logical local commits.

## Validation

Pending implementation.
