# Production deployment

## Reference architecture

```text
Cloudflare Pages (static files)
        |
        | browser HTTPS
        v
Google Cloud Run (Go API) ----> external DLT API
        |
        v
managed PostgreSQL (pooled TLS connection)
```

This keeps the UI globally cacheable, lets the API scale to zero, and uses
PostgreSQL as the only datastore. The repository does not provision accounts or
resources automatically.

## 1. PostgreSQL

Create a production database with TLS and provider-managed backups. Use the
provider's pooled application connection string when available, and keep its
region close to Cloud Run.

Store the URL in Google Secret Manager as `DATABASE_URL`. A typical URL ends in
`?sslmode=require`. Do not put it in GitHub variables, workflow files, or
Cloudflare build variables.

With the checked-in defaults, two API instances times five pool connections
means at most ten application connections, plus provider/admin overhead. Lower
`DB_MAX_CONNS` if the database plan is smaller.

Migrations run on API startup, are transactionally serialized with a PostgreSQL
advisory lock, and use additive SQL. Take a backup before a destructive future
migration.

## 2. Cloud Run API

Build `apps/api/Dockerfile`. The final image runs as a non-root user and
contains `/app/api` plus the one-shot `/app/maintenance` command.

The checked-in `.github/workflows/deploy-api.yml` is manual-only. Configure a
GitHub `production` environment, require reviewer approval, and add these
repository variables:

| Variable | Meaning |
| --- | --- |
| `GCP_PROJECT_ID` | Google Cloud project |
| `GCP_REGION` | API and image region, usually `asia-southeast1` after checking database latency |
| `GCP_ARTIFACT_REPOSITORY` | Artifact Registry Docker repository |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Full GitHub OIDC provider resource name |
| `GCP_SERVICE_ACCOUNT` | Least-privilege deployer service account |
| `CORS_ALLOWED_ORIGINS` | Comma-separated production frontend origins |

Create Secret Manager secrets named `DATABASE_URL` and
`DLT_WORKFILTER_TOKEN`. Grant the Cloud Run runtime identity access only to
those secrets. The GitHub workflow uses Workload Identity Federation; do not
create a long-lived service-account JSON key.

The deployment defaults are deliberately small:

- request-based billing;
- minimum instances `0`, maximum instances `2`;
- 1 vCPU, 256 MiB;
- Cloud Run concurrency `20`;
- at most four simultaneous DLT calls per API instance;
- five PostgreSQL connections per API instance.

The service exposes:

- `/healthz`: process liveness, independent of PostgreSQL;
- `/readyz`: PostgreSQL-backed readiness;
- `/docs`: OpenAPI UI.

Set a Cloud Run startup probe to `/healthz` and a liveness probe to `/healthz`.
Use `/readyz` from external monitoring so a disconnected database is visible.

## 3. Cloudflare Pages frontend

Connect the GitHub repository to Pages with:

| Setting | Value |
| --- | --- |
| Root directory | `apps/web` |
| Build command | `npm ci && npm run build` |
| Build output | `out` |
| Node version | `26` (or the exact `.nvmrc` version) |

Set `NEXT_PUBLIC_API_URL` to the public Cloud Run URL and
`NEXT_PUBLIC_SITE_URL` to the canonical HTTPS site origin before building.
Set `NEXT_PUBLIC_SITE_NAME` to the selected public brand. These are public
browser values, not secrets. Configure the same
Pages/custom-domain origin in `CORS_ALLOWED_ORIGINS`. Builds without a site URL
deliberately emit `noindex` metadata to prevent an accidental preview from
competing with production.

The static `_headers` file supplies basic browser security headers and
immutable caching for content-hashed Next.js assets. Its referrer policy
preserves the origin required by OpenStreetMap's public tile usage policy.

Deploy previews must either use a separately allowed API origin or accept that
browser CORS calls will be blocked. Avoid a wildcard production origin.

## 4. Retention maintenance

Run the same image as a one-shot Cloud Run Job with command
`/app/maintenance`. Give it the runtime database secret and these optional
variables:

| Variable | Default | Purpose |
| --- | ---: | --- |
| `SLOT_SNAPSHOT_RETENTION_DAYS` | 365 | Delete older raw slot observations |
| `FETCH_LOG_RETENTION_DAYS` | 30 | Delete older operational fetch records |

Schedule the job weekly with Cloud Scheduler after one manual successful run.
The command is idempotent and exits after one bounded transaction; it is not an
always-on worker. Identical slot payloads are already collapsed inside a
six-hour heartbeat, while changed payloads remain separate observations.

## 5. Monitoring and low-attention operation

At minimum:

- uptime check `/healthz` and database-aware check `/readyz`;
- alert on sustained 5xx responses, readiness failures, and instance saturation;
- log-based alert for repeated `DLT upstream returned status` errors;
- monthly cloud budget and anomaly alerts;
- database storage, connection, backup, and restore alerts;
- weekly dependency pull requests and required CI.

Run a restore rehearsal before launch and at least quarterly. A backup that has
never been restored is not a verified recovery plan.

## 6. Rollback

1. Stop the rollout if `/healthz` or `/readyz` fails.
2. Send Cloud Run traffic back to the previous healthy immutable revision.
3. Roll Cloudflare Pages back to the previous deployment independently.
4. Keep the previous revision database-compatible. Do not reverse a migration
   during an incident unless a tested recovery procedure requires it.
5. If data is damaged, isolate writes, preserve logs, and restore into a new
   database before changing the production URL.

## Environment contract

| Variable | Default | Runtime |
| --- | --- | --- |
| `PORT` | `8080` | Cloud Run API port; overrides `API_PORT` |
| `API_PORT` | `8080` | Local API port fallback |
| `DATABASE_URL` | local Compose URL | PostgreSQL connection |
| `DATABASE_REQUIRED` | `false` | Set `true` in production |
| `DB_MAX_CONNS` | `5` | Per-instance pool limit |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` | Exact comma-separated browser origins |
| `DLT_API_BASE_URL` | current DLT host | Upstream base URL |
| `DLT_WORKFILTER_TOKEN` | empty | Opaque upstream work-filter value |
| `DLT_MAX_CONCURRENCY` | `4` | Per-instance upstream request cap |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | Build-time frontend API URL |
| `NEXT_PUBLIC_SITE_URL` | empty (`noindex`) | Canonical site origin; required for a public indexed build |
| `NEXT_PUBLIC_SITE_NAME` | `DLT Smart Queue Fast` | Public site name used in page metadata and homepage structured data |
