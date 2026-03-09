# Security model

## Principles

- Treat all uploads and manifests as hostile
- No execution of user-provided or uploaded code
- Server-side validation only; never trust client
- No secrets in logs; safe temp dirs; path traversal prevention

## Submission

- Rate limit: 10 submissions per IP per minute
- Body: JSON with `manifest` (or root = manifest). Validated with zod; invalid payloads rejected with 400
- Stored as pending; admin approves or rejects. No automatic publish

## Archive handling

- Max size 50MB
- Extract with path normalization; reject entries with `..` or absolute paths
- MIME/type: we serve tar.gz; no arbitrary binary execution

## Admin

- Admin routes require `Authorization: Bearer <ADMIN_TOKEN>`
- If ADMIN_TOKEN is empty, admin routes always return 401
- Audit log records submission approve/reject

## CSP and headers

- Set Content-Security-Policy and secure defaults in production (see deployment docs)
- No inline scripts from user content; markdown rendered with sanitization if needed

## CLI install

- Registry install: fetch metadata, download archive, verify checksum (if provided), extract to `.zoar/agents/<slug>/<version>`
- Offline install from file: same extract path checks; optional `--checksum` to verify
- No execution of installed files by the CLI
