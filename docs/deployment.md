# Deployment

## Requirements

- Node.js 22+
- PostgreSQL
- pnpm

## Steps

1. Clone repo; run `pnpm install`
2. Build: `pnpm build`
3. Set env (see `.env.example`): `DATABASE_URL`, optional `ADMIN_TOKEN`, `NEXT_PUBLIC_APP_URL`, `TEMPLATES_DIR`
4. Run migrations: `pnpm db:migrate`
5. Seed built-in templates: `pnpm db:seed`
6. Start: `pnpm start` (or run Next.js in production mode)

## Environment

- **DATABASE_URL**: PostgreSQL connection string
- **ADMIN_TOKEN**: Secret for admin API (approve/reject submissions). If unset, admin routes return 401
- **NEXT_PUBLIC_APP_URL**: Public URL of the app (for archive URLs in API). Default from VERCEL_URL or localhost
- **TEMPLATES_DIR**: Path to templates directory (default: repo `templates/` relative to app cwd)

## Reverse proxy

Example nginx location:

```nginx
location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Health

- `GET /api/v1/health` – liveness
- `GET /api/v1/ready` – readiness (DB check)
