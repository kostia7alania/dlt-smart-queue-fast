# Feature 013: Production and Open-Source Deployment

**Status:** Complete  
**Created:** 2026-07-24

## Goal

Make the existing public, read-only DLT discovery MVP safe to run for long
periods with minimal operator attention while keeping the application portable
and ready to publish as open source.

## User Stories

### P1 — Reliable public service

As an operator, I can deploy the Go API as a bounded Cloud Run container and
the Next.js UI as static assets, with explicit readiness, graceful shutdown,
safe database startup, and protection for the external DLT service.

### P1 — Bounded data growth

As an operator, I can retain useful slot history without storing unlimited
duplicate observations or operational fetch logs.

### P2 — Repeatable delivery

As a maintainer, I can validate changes in CI and deploy an immutable API
revision through short-lived GitHub OIDC credentials.

### P2 — Honest open source

As a contributor or self-hoster, I can understand the license, attribution,
security-reporting process, architecture, environment variables, and deployment
steps without relying on private chat context.

## Functional Requirements

1. The API MUST accept Cloud Run's `PORT` variable and retain `API_PORT` for
   local compatibility.
2. Production configuration MUST be able to require PostgreSQL; a required
   database failure MUST stop startup instead of silently enabling live-only
   mode.
3. `/healthz` MUST remain a process liveness check. `/readyz` MUST report
   persistence readiness and fail when the store is absent or unreachable.
4. The HTTP server MUST have bounded timeouts, handle SIGINT/SIGTERM, close its
   listener gracefully, and close the PostgreSQL pool.
5. CORS MUST allow only configured origins and the GET/OPTIONS methods used by
   the public UI.
6. Each API instance MUST bound simultaneous DLT upstream calls.
7. Identical slot payloads MUST be deduplicated inside a bounded heartbeat
   window while changed payloads remain historical observations.
8. A maintenance command MUST prune operational fetch logs and old raw slot
   snapshots using configurable retention periods.
9. Concurrent migration attempts MUST be serialized inside PostgreSQL.
10. The API MUST have a reproducible non-root multi-stage container build.
11. The frontend MUST build as a static Next.js export suitable for Cloudflare
    Pages and ship static security headers.
12. CI MUST run Go tests/lint, PostgreSQL integration tests, web lint/tests/
    typecheck/static build, and the API container build.
13. The repository MUST include a manual-safe Cloud Run deployment workflow
    using GitHub OIDC, plus dependency update configuration.
14. The repository MUST include an OSI-compatible license, attribution notice,
    contribution guide, security policy, and production deployment runbook.

## Non-Goals

- Provisioning or mutating the user's Cloudflare, Google Cloud, Neon, domain
  registrar, or GitHub settings.
- Buying a domain or publishing the repository.
- Authentication, billing, booking automation, Redis, queues, or background
  workers.
- Running the Next.js server in production.
- Hiding external DLT failures; stored fallback freshness remains visible.

## Success Criteria

- All feature tasks are checked with recorded validation evidence.
- `go test ./...`, golangci-lint, PostgreSQL integration tests, Biome, Node
  tests, TypeScript, static Next build, and Docker build pass.
- Static output contains every public route plus `robots.txt` and `sitemap.xml`.
- The API container runs as a non-root user and exposes correct liveness and
  readiness behavior.
- The working tree is clean after logical local commits; no push or external
  deployment occurs.
