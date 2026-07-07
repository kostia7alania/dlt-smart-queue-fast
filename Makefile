.PHONY: up down db-reset api-dev web-dev test

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
