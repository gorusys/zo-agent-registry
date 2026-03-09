.PHONY: install build lint typecheck test test-e2e dev start db-migrate db-seed cli docker-up docker-build

install:
	pnpm install

build:
	pnpm build

lint:
	pnpm lint

typecheck:
	pnpm typecheck

test:
	pnpm test

test-e2e:
	pnpm test:e2e

dev:
	pnpm dev

start:
	pnpm --filter web start

db-migrate:
	pnpm db:migrate

db-seed:
	pnpm db:seed

cli:
	pnpm cli -- --help

docker-build:
	docker compose build

docker-up:
	docker compose up --build -d
