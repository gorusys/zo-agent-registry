# Inbox Summary

Produces a daily or weekly summary of inbox for triage. Read-only; no email sending or modification.

## Setup

Set INBOX_SOURCE to a path or read-only API that returns inbox items (JSON array). Optionally set INBOX_LIMIT and OUTPUT_PATH.

## Schedule

Run daily (e.g. cron `0 8 * * *`).

## Output

JSON with summary, priority buckets, and themes.

## License

Apache-2.0
