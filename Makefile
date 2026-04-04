.PHONY: up down api-dev web-dev test

up:
	docker-compose up -d

down:
	docker-compose down

api-dev:
	cd apps/api && go run cmd/server/main.go

web-dev:
	cd apps/web && npm run dev

test:
	cd apps/api && go test ./...
	cd apps/web && npm run test
