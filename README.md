# Zo Agent Registry

Open registry of reusable agent templates for Zo Computer users. Browse, validate, install, and submit templates. Portable, file-based, self-hostable.

## Quick start

```bash
pnpm install
pnpm build
# Set DATABASE_URL (PostgreSQL), then:
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start web app (Next.js) |
| `pnpm build` | Build all packages and web app |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Type check all packages |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run Playwright e2e (start app first or set BASE_URL) |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:seed` | Seed built-in templates |
| `pnpm cli -- --help` | CLI help (zoar) |

## CLI (zoar)

- `zoar init` – create `.zoar` directory
- `zoar validate <path>` – validate template
- `zoar pack <path>` – create tar.gz
- `zoar install <slug>` – install from registry
- `zoar install --from-file <path>` – install from file/folder
- `zoar list` – list installed agents
- `zoar doctor` – check environment
- `zoar export-manifest <path>` – export manifest JSON
- `zoar schema` – print JSON Schema

## Docker

```bash
docker compose up --build
# Web: http://localhost:3001, DB: localhost:5432
# Run migrations: docker compose exec web pnpm exec prisma migrate deploy
# Seed: docker compose exec web pnpm exec prisma db seed
```

## Docs

See `/docs`: overview, architecture, manifest spec, security, deployment, Zo deployment, contributing, assumptions.

## License

Apache-2.0. Templates are user-contributed; review before use. Not officially endorsed by Zo Computer.
