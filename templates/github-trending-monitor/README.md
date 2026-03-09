# GitHub Trending Monitor

Tracks trending repositories on GitHub by language and period.

## Setup

Set `GITHUB_LANGUAGES` (e.g. `typescript,python`) and optionally `GITHUB_TOKEN` and `OUTPUT_PATH` in `.env`.

## Schedule

Run daily (e.g. cron `0 8 * * *`).

## Output

JSON report with `repos` array and `generatedAt` timestamp.

## License

Apache-2.0
