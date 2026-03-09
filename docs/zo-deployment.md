# Zo deployment (portable model)

This document describes how to run the Zo Agent Registry in a way that fits a Zo Computer or any Linux server, **without** relying on undocumented or private Zo APIs.

## Model

1. **Web app**: Run the Next.js app as a hosted app on Zo (or any Node host). It serves the UI and JSON API. Database: PostgreSQL (Zo may provide a DB or you use an external one).
2. **Templates on disk**: The built-in (or approved) templates live in a directory (e.g. `templates/`) that the app can read. The archive download endpoint packs from this directory on demand.
3. **CLI and cron on the same box**: Users (or you) run `zoar` on the same Linux machine to install templates into `.zoar/agents/<slug>`. Scheduled runs are done by **your** scripts and cron, not by the registry. Example cron for a daily digest:
   ```cron
   0 7 * * * cd /home/user/.zoar/agents/daily-research-digest/1.0.0 && /path/to/your/runner
   ```
4. **No Zo-specific APIs**: We do not call Zo internal APIs. If Zo later provides an official API for scheduling or agents, this registry can be extended to reference it. Until then, everything is file-based and portable.

## Assumptions

- Zo can run a Node.js app and expose it (e.g. as a hosted site).
- PostgreSQL is available (Zo-provided or external).
- Template files are deployed with the app or mounted (e.g. `templates/` in the repo or a volume).
- Execution of installed agents is the user’s responsibility (own runner, cron, or future Zo scheduler).

## Reproducibility

- Same manifest + same template files → same checksum from `zoar pack`
- Install verifies checksum when provided by the registry
