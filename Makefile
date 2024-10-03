.PHONY: db
db:
	docker compose up -d

.PHONY: db-down
db-down:
	docker compose down

.PHONY: db-logs
db-logs:
	docker compose logs -f

.PHONY: migrate
migrate:
	npx prisma migrate dev

.PHONY: generate
generate:
	npx prisma generate

.PHONY: schema-format
schema-format:
	npx prisma format

.PHONY: format
format:
	make schema-format