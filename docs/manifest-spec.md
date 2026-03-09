# Manifest spec

Agent templates are described by `agent.manifest.json` with schema version `1.0`.

## Required fields

- **schemaVersion**: `"1.0"`
- **slug**: lowercase alphanumeric and hyphens only (e.g. `daily-research-digest`)
- **name**: Human-readable name
- **summary**: Short one-line summary (max 500 chars)
- **description**: Full description
- **version**: Semver (e.g. `1.0.0`)
- **authors**: Array of `{ name, email?, url? }`, at least one
- **license**: SPDX or license name (e.g. `Apache-2.0`)

## Optional fields

- **homepage**, **repository**: URLs
- **tags**: Array of strings
- **category**: One of `research`, `monitoring`, `digest`, `personal-ops`, `developer-productivity`, `other`
- **capabilities**: Array of strings (e.g. `http`, `read-only`)
- **inputs**, **outputs**: `{ description?, schema?, required? }`
- **env**: Array of `{ name, description?, required?, secret?, example? }`
- **schedule**: Array of `{ cron?, interval?, description? }`
- **files**: Array of `{ path, description? }`
- **examples**: Array of `{ name, path?, description?, output? }`
- **safety**: Array of `{ category, description }`
- **compatibility**: `{ zoFriendly?, minZoVersion?, platforms?, notes? }`
- **installation**: `{ steps?, requirements? }`
- **execution**: `{ command?, args?, env?, workingDir?, notes? }`
- **changelog**: Array of `{ version, date?, changes }`
- **checksum**: Optional SHA-256 of packed archive

## Template directory layout

- `agent.manifest.json` (required)
- `prompt.md` (required)
- `README.md` (required)
- `.env.example` (recommended)
- `examples/` (optional)
- `assets/` (optional)

Validation: use `zoar validate <path>`. JSON Schema: `zoar schema` or `/api/openapi.json`.
