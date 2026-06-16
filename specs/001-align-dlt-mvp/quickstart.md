# Quickstart: DLT Read-Only Discovery MVP

## Prerequisites

- Docker and Docker Compose
- Go 1.24+
- Node.js compatible with `apps/web/package.json`

## Start Local Services

```bash
npm --prefix apps/web install
make up
make api-dev
make web-dev
```

The frontend playground calls the Go API through `NEXT_PUBLIC_API_URL`, which defaults
to `http://localhost:8080` in `.env.example`.

## Validate Backend

```bash
curl http://localhost:8080/healthz
curl http://localhost:8080/v1/dlt/offices
curl http://localhost:8080/v1/dlt/offices/47/work-availability
curl http://localhost:8080/v1/dlt/vehicles
curl "http://localhost:8080/v1/dlt/work-types?siteId=47&groupId=4&keyword=%20NEW%20THAI"
curl http://localhost:8080/v1/dlt/work-types/111093/holidays
curl "http://localhost:8080/v1/dlt/work-types/111093/slots?currentDate=2026-04-04"
```

## Validate OpenAPI

Open the local API docs endpoint documented by the Go server and confirm all `/v1/dlt`
endpoints are present.

## Validate Frontend

Run the available frontend checks:

```bash
npm --prefix apps/web run test
npm --prefix apps/web run build
```

Open the Next.js playground and run the DLT lookup flow:

1. Load offices.
2. Select an office.
3. Load work availability.
4. Load vehicle types.
5. Resolve work types.
6. Load holidays and slots.

Confirm preserved strings such as `Car and Motocycle`, `car`, and `เต็ม` remain
unchanged.
