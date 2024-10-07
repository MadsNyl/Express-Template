.PHONY: db
db:
	docker compose up -d db

.PHONY: db-down
db-down:
	docker compose down db

.PHONY: db-logs
db-logs:
	docker compose logs -f

.PHONY: dev
dev:
	@make db
	@make migrate
	@make generate
	npm run dev

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
	npm run format

.PHONY: test
test:
	@trap 'docker compose down test-db' EXIT; \
	docker compose up -d test-db && \
	npm run migrate:test && \
	npm run test -- $(args)