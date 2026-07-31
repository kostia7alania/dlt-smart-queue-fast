.PHONY: up down db-reset api-dev maintenance web-install web-dev web-build api-image test lint fmt check

up:
	docker compose up -d --wait

down:
	docker compose down

# Destroy the local database volume and start fresh (schema is re-applied
# by the API at startup).
db-reset:
	docker compose down -v
	docker compose up -d --wait

api-dev:
	cd apps/api && go run ./cmd/server

maintenance:
	cd apps/api && go run ./cmd/maintenance

web-install:
	cd apps/web && npm ci

web-dev:
	cd apps/web && npm run dev

web-build:
	cd apps/web && npm run build

api-image:
	docker build -t dlt-smart-queue-api:local apps/api

test:
	cd apps/api && go test ./...
	cd apps/web && npm run lint && npm run test && npm run typecheck && npm run data:check

# Requires golangci-lint v2: go install github.com/golangci/golangci-lint/v2/cmd/golangci-lint@latest
lint:
	cd apps/api && golangci-lint run
	cd apps/web && npm run lint

fmt:
	cd apps/api && golangci-lint fmt
	cd apps/web && npm run format

check: test lint web-build api-image
