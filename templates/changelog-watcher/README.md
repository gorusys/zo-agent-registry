# Changelog Watcher

Watches configured changelog URLs and feeds; outputs a digest of new entries.

## Setup

Set CHANGELOG_URLS (and optionally SINCE_DAYS, OUTPUT_PATH) in `.env`.

## Schedule

Run daily (e.g. cron `0 6 * * *`).

## Output

Markdown or JSON digest with entries and generatedAt.

## License

Apache-2.0
