# Overview

Zo Agent Registry is an open, self-hostable registry of reusable agent templates for Zo Computer users and other Linux environments.

## Purpose

- **Browse** agent templates by category, tag, and capability
- **Validate** templates locally with the CLI
- **Install** templates into a local `.zoar/agents/<slug>` directory
- **Schedule** runs using cron or your own scheduler (no execution engine in the registry)
- **Submit** new templates for community review; admins approve or reject

Templates are declarative: manifest, prompt, env example, and optional examples. The registry does not execute agent code. You run templates with your own trusted runtime.

## Components

- **Web app**: Next.js UI and JSON API
- **CLI (`zoar`)**: init, validate, pack, install, list, doctor, schema
- **Shared packages**: manifest schema (zod + JSON Schema), registry-core (validation, pack, safe extract)

## License

Apache-2.0. Template entries are user-contributed; review before use. No trademark claim on Zo Computer.
