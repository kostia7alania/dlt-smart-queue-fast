# Verification

Run checks from the repository root unless noted otherwise. Record the
revision, command, result and any skipped integration coverage. Historical
results in `specs/*/tasks.md` are not current production health checks.

## Local Code Checks

```bash
make test       # Go tests, dataset reproducibility, Biome, Node tests, TypeScript
make lint       # Go lint and Biome; requires golangci-lint v2
make web-build  # static export into apps/web/out
```

Go's HTTP tests need access to a local loopback listener. PostgreSQL integration
tests skip unless `TEST_DATABASE_URL` is set. To exercise them, start the local
test database, then run from `apps/api`:

```bash
TEST_DATABASE_URL='postgres://myuser:mypassword@localhost:5432/mydb?sslmode=disable' \
  go test ./internal/repo
```

Use the configured local test database and matching port. Integration tests
create isolated schemas; do not point them at production.

## Product and Export Checks

- Start services with `make up`, `make api-dev`, and `make web-dev`. Confirm
  direct browser-to-Go API calls, CORS, `/docs`, `/healthz`, and `/readyz`.
- Follow `/licence` -> journey -> office -> Calendar/Compare -> official link.
  Check one long guide and one office page on desktop and mobile.
- Check URL state, Back/Forward, stale-request cancellation, source/freshness
  labels, Map's five statuses, and stored-only History semantics.
- Build with explicit `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_SITE_NAME` for
  canonical, sitemap, robots, metadata and brand checks. This is not a deploy.
- Inspect exported HTML for all sitemap paths, correct self-canonicals and
  internal links. Keep `/playground` excluded and retired guide URLs redirected.
- Stop the API separately to verify degradation. A successful static build
  does not establish that every interactive failure state is usable.

## Source and Data Review

`npm --prefix apps/web run data:check` only compares the directory with committed
inputs. It does not query DLT or prove current office availability.

```bash
node tools/content-review.mjs --today=2026-09-11
node tools/content-review.mjs --today=2026-09-11 --days=30
```

The default threshold is 180 days; 30 days is a stricter audit option. Review
the listed sources before changing dates or claims. Current results belong in
[PROJECT_STATUS.md](PROJECT_STATUS.md); outstanding work belongs in
[BACKLOG.md](BACKLOG.md).
