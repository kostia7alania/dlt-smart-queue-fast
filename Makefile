.PHONY: up down db-reset api-dev web-dev test lint fmt

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
	cd apps/api && go run cmd/server/main.go

web-dev:
	cd apps/web && npm run dev

test:
	cd apps/api && go test ./...
	cd apps/web && npm run lint && npm run test

# Requires golangci-lint v2: go install github.com/golangci/golangci-lint/v2/cmd/golangci-lint@latest
lint:
	cd apps/api && golangci-lint run
	cd apps/web && npm run lint

fmt:
	cd apps/api && golangci-lint fmt
	cd apps/web && npm run format
