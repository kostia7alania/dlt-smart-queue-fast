# DLT Smart Queue Fast

An unofficial, read-only explorer for Thailand DLT Smart Queue offices, work
types, appointment availability, comparisons, maps, and stored slot history.
It helps people find a suitable office and date; it does not book appointments,
collect personal data, or impersonate the Department of Land Transport.

## What is included

- Static Next.js 16 interface with calendar, map, office comparison, history,
  and an API playground.
- Go 1.26 API using Chi and Huma, with OpenAPI documentation at `/docs`.
- PostgreSQL 18 persistence using pgx, plain SQL, and embedded migrations.
- Bounded upstream concurrency, strict CORS, health/readiness endpoints,
  snapshot deduplication, and a one-shot retention command.
- CI, a non-root container, and deployment templates for Cloudflare Pages,
  Google Cloud Run, and any PostgreSQL provider.

The MVP intentionally has no authentication, payments, Redis, queue, or
background worker.

## Local development

Prerequisites: Docker with Compose, Go 1.26+, Node.js 26, npm, and
golangci-lint v2 for linting.

```bash
cp .env.example .env
make up
```

In separate terminals:

```bash
make api-dev
make web-install
make web-dev
```

Open:

- UI: <http://localhost:3000>
- API docs: <http://localhost:8080/docs>
- liveness: <http://localhost:8080/healthz>
- readiness: <http://localhost:8080/readyz>

The frontend reads `NEXT_PUBLIC_API_URL` at build time. Restart or rebuild it
after changing that value.

## Useful commands

```bash
make test          # Go, frontend model tests, Biome, and TypeScript
make lint          # golangci-lint and Biome
make web-build     # production static export to apps/web/out
make api-image     # local API image
make maintenance   # one-shot retention against DATABASE_URL
make check         # full local verification
```

To run PostgreSQL integration tests locally:

```bash
TEST_DATABASE_URL='postgres://myuser:mypassword@localhost:5432/mydb?sslmode=disable' \
  go test ./apps/api/internal/repo
```

## API examples

```bash
curl http://localhost:8080/v1/dlt/offices
curl 'http://localhost:8080/v1/dlt/work-types?siteId=47&groupId=4&keyword=%20NEW%20THAI'
curl 'http://localhost:8080/v1/dlt/work-types/111093/slots?currentDate=2026-07-24'
curl 'http://localhost:8080/v1/dlt/map-availability?keyword=%20NEW%20THAI&groupId=4&currentDate=2026-07-24'
curl 'http://localhost:8080/v1/dlt/history/slots?workTypeId=111093&limit=20'
```

## Production and self-hosting

The maintained production shape is a static Cloudflare Pages site, a Cloud Run
API, and managed PostgreSQL. The application remains portable: the exported
frontend can use any static host, the API is an OCI image, and the database is
standard PostgreSQL.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for configuration, secrets,
backups, monitoring, maintenance, cost limits, and rollback.

## Contributing and security

Read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a change. Please
report vulnerabilities privately using
[GitHub private vulnerability reporting](https://github.com/kostia7alania/dlt-smart-queue-fast/security/advisories/new),
as described in [SECURITY.md](SECURITY.md).

## License and attribution

Copyright 2026 DLT Smart Queue Fast contributors.

Source code is licensed under
[GNU AGPL version 3 or later](LICENSE). Network deployments that modify the
program must offer their corresponding source as required by the license.
External data and maps retain their own terms; see
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
