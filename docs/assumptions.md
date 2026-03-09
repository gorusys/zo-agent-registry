# Assumptions

This document records assumptions made when building the Zo Agent Registry where the full context was not specified.

1. **Zo Computer**: Described as a personal cloud Linux server with AI, hosted apps, scheduled agents, and integrations. We assume no private Zo APIs are used; deployment is portable and file-based. If Zo provides official APIs later, they can be integrated.

2. **Admin auth**: No passwordless email or OAuth in MVP. Admin publishing is protected by a single shared secret (`ADMIN_TOKEN`). If unset, admin routes return 401.

3. **Templates directory**: Built-in templates live in repo `templates/`. In production, `TEMPLATES_DIR` can point to the same or a mounted path. Archive endpoint packs from disk on demand.

4. **PostgreSQL**: Chosen as the only DB. No Redis/BullMQ in MVP; rate limiting is in-memory (single-instance). For multi-instance, use an external rate limiter or Redis later.

5. **Checksum**: Stored per version; generated at pack time. Registry may store it when admin approves (optional enhancement). CLI verifies when the API returns a checksum.

6. **Next.js**: App Router; API routes in `app/api/`. No separate API server.

7. **CLI install from registry**: Assumes registry base URL is passed or default `http://localhost:3001`. Archive URL is `GET /api/v1/agents/:slug/versions/:version/archive`; response includes `X-Checksum-SHA256` when packed on the fly.

8. **Unknown Zo behavior**: Any Zo-specific behavior (e.g. how hosted apps are started, how cron is exposed) is documented as unknown; we provide portable fallbacks (cron examples, file-based install).
