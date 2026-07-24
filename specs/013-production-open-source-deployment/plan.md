# Feature 013 Plan

## Architecture

```text
Cloudflare Pages (static Next.js) -> browser -> Cloud Run (Go API)
                                                 |-> Neon PostgreSQL
                                                 `-> external DLT API
GitHub Actions -> CI -> immutable Cloud Run revision (OIDC)
Cloud Run Job command -> bounded database maintenance
```

The frontend remains a static client. The Go API owns upstream normalization,
persistence, readiness, retention, and safety limits. PostgreSQL remains the
only datastore.

## Implementation Slices

1. **Runtime safety:** typed environment configuration, bounded HTTP server,
   graceful shutdown, pool lifecycle, strict CORS, liveness/readiness.
2. **Upstream and storage safety:** per-instance DLT concurrency limit,
   unchanged-payload heartbeat deduplication, configurable maintenance command,
   serialized migrations.
3. **Build and delivery:** API multi-stage container, Next static export,
   Cloudflare static headers, CI, OIDC deployment template, Dependabot.
4. **Open-source operations:** license, attribution, contribution/security
   policies, environment contract, deployment/rollback/backup runbook.

## Deployment Defaults

- Region: `asia-southeast1` unless a nearer common Cloud Run/Neon region is
  selected before provisioning.
- Cloud Run: request-based billing, minimum instances 0, maximum instances 3,
  public HTTPS, 1 vCPU, 512 MiB.
- Database: pooled application URL with TLS; bounded application pool.
- Maintenance: daily Cloud Run Job invocation, fetch logs 30 days, raw slot
  observations 365 days. Changed observations are always retained inside the
  active window; identical observations have a six-hour heartbeat.
- Frontend: Cloudflare Pages root `apps/web`, build `npm ci && npm run build`,
  output `out`, Node from the repository's 26.x contract.

## Constitution Check

- No new datastore, queue, worker, auth, or booking behavior.
- PostgreSQL remains the only persistent store.
- Business and retention logic stay in Go/plain SQL.
- Next.js remains UI-only and becomes more static, not less.
- External DLT payload strings remain unchanged.
- New behavior is covered by focused tests and existing full checks.

## Rollback

- Cloud Run revisions are immutable; restore traffic to the previous healthy
  revision.
- Cloudflare Pages supports deployment rollback independently.
- Database migrations remain forward-only and transaction-safe. Application
  changes must stay compatible with the current and immediately previous schema.
