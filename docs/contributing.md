# Contributing

## Development

- `pnpm install` then `pnpm dev` for the web app
- Run `pnpm db:migrate:dev` and `pnpm db:seed` for local DB
- CLI: `pnpm cli -- <args>` from repo root

## Adding a template

1. Create a directory under `templates/<slug>/` with `agent.manifest.json`, `prompt.md`, `README.md`, `.env.example`, and optional `examples/`
2. Run `zoar validate templates/<slug>`
3. Submit via web form or `POST /api/v1/submissions` with the manifest
4. An admin approves; then it appears in browse and API

## Code

- TypeScript strict; no placeholders (TODO/FIXME) in production paths
- Tests: unit (Vitest), e2e (Playwright for web)
- Lint: ESLint; format: Prettier

## License

Apache-2.0. By contributing you agree that your contributions are under the same license. We do not require a formal DCO; submitting a PR implies your consent to license under Apache-2.0.

## Disclaimer

Registry entries are user-contributed templates. The project does not endorse or execute them; review before use.
