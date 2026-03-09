# Operations

## Logging

- Use structured logs; include request ID where available (submissions, audit log)
- Do not log secrets (tokens, credentials) or full manifest payloads in production

## Graceful shutdown

- Next.js handles SIGTERM; allow in-flight requests to complete
- Prisma: connection pool is closed on process exit

## DB

- Migrations: `pnpm db:migrate` (deploy) or `pnpm db:migrate:dev` (dev with generate)
- Backup PostgreSQL regularly; no built-in backup in this app

## Admin workflow

1. List pending: `GET /api/admin/submissions` with `Authorization: Bearer <ADMIN_TOKEN>`
2. Approve: `PATCH /api/admin/submissions/:id` with `{ "status": "approved" }`
3. Reject: `PATCH` with `{ "status": "rejected", "reason": "..." }`

Approved submissions create or update Agent and AgentVersion; tags are replaced from manifest.

## Audit

- AuditLog stores action, resource, resourceId, details, requestId, createdAt
- Query for submission approvals/rejections and security reviews
