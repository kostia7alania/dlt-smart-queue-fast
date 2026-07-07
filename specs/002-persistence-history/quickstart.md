# Quickstart: Persistence and History

## Prerequisites

- Docker and Docker Compose
- Go 1.24+
- Node.js compatible with `apps/web/package.json`

## Start Local Services

```bash
make up          # PostgreSQL (myuser/mypassword/mydb on :5432)
make api-dev     # applies migrations at startup, then serves :8080
make web-dev
```

On startup the API logs applied migrations. If PostgreSQL is unreachable, the API
logs a warning and continues in live-only mode.

## Validate Persistence (US1)

```bash
# Trigger live fetches (these now persist as a side effect)
curl http://localhost:8080/v1/dlt/offices > /dev/null
curl "http://localhost:8080/v1/dlt/work-types?siteId=47&groupId=4&keyword=%20NEW%20THAI" > /dev/null
curl "http://localhost:8080/v1/dlt/work-types/111093/slots?currentDate=2026-07-07" > /dev/null

# Inspect stored rows
docker compose exec postgres psql -U myuser -d mydb -c \
  "SELECT sit_id, sit_name, fetched_at FROM dlt_offices LIMIT 5;"
docker compose exec postgres psql -U myuser -d mydb -c \
  "SELECT tyw_id, keyword, fetched_at FROM dlt_work_types;"
docker compose exec postgres psql -U myuser -d mydb -c \
  "SELECT id, tyw_id, current_date_param, fetched_at FROM dlt_slot_snapshots ORDER BY id DESC LIMIT 3;"
```

## Validate Fetch Log (US2)

```bash
curl "http://localhost:8080/v1/dlt/fetches?limit=10"
```

Expect newest-first entries with `kind`, `params`, `ok`, `duration_ms`, `fetched_at`.

## Validate Snapshot Reads (US3)

```bash
curl http://localhost:8080/v1/dlt/snapshots/offices
curl "http://localhost:8080/v1/dlt/snapshots/work-types?siteId=47&groupId=4&keyword=%20NEW%20THAI"
curl "http://localhost:8080/v1/dlt/snapshots/slots?workTypeId=111093"
```

Each response includes `fetched_at`. Slot payloads must contain preserved strings
such as `เต็ม` exactly as fetched.

## Validate Degradation (FR-008 / FR-009)

```bash
make down
curl http://localhost:8080/v1/dlt/offices          # still 200 (live)
curl http://localhost:8080/v1/dlt/snapshots/offices # readable 503
```

(Restart the API after `make up` to reconnect, or rely on pool recovery.)

## Validate Playground (US4)

Open `/playground`, run live steps, then use the "Snapshots & freshness" section:

1. Load the fetch log and confirm timestamps for the live steps just executed.
2. Load offices/work-types/slots snapshots and confirm stored JSON + `fetched_at`.
3. Stop PostgreSQL and confirm snapshot controls show a readable error while live
   steps keep working.
