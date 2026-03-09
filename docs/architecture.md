# Architecture

## Monorepo

- `apps/web` – Next.js 15 App Router, Prisma, API routes
- `packages/cli` – zoar CLI (commander)
- `packages/manifest-schema` – zod schema + JSON Schema export
- `packages/registry-core` – validate template dir, pack tar.gz, extract with zip-slip prevention
- `packages/ui` – shared React components (Badge, etc.)
- `templates/` – built-in agent templates (5)
- `docs/` – markdown documentation
- `prisma/` – schema and migrations (in apps/web)

## Data flow

1. **Publish**: Admin approves submission → Agent/AgentVersion/AgentTag created or updated.
2. **Browse**: Web and API read from Prisma (published agents only).
3. **Install**: CLI fetches `/api/v1/agents/:slug/versions`, downloads archive, verifies checksum, extracts to `.zoar/agents/<slug>/<version>`.

## Security

- Submissions: rate-limited, server-side validation only, no execution of uploaded code
- Archive download: 50MB limit, path traversal blocked on extract
- Admin: token-based (ADMIN_TOKEN env)
- No secrets in logs; request IDs for audit

## Deployment

- Next.js runs as Node server; Prisma uses PostgreSQL
- Templates on disk (TEMPLATES_DIR) for archive endpoint; DB for metadata
- Zo: run web on Zo-hosted app, CLI and cron on same Linux box; see docs/zo-deployment.md
