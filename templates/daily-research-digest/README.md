# Daily Research Digest

Compiles a daily digest of research papers and articles from configured feeds and topics.

## Requirements

- Node.js 22+ or your preferred runtime
- Access to the configured feed URLs (RSS/Atom) and optionally arXiv API

## Setup

1. Copy `.env.example` to `.env` and set:
   - `FEED_URLS`: Comma-separated RSS/Atom URLs
   - Optionally `ARXIV_CATEGORIES` and `OUTPUT_DIR`
2. Run your executor with this directory as the agent workspace.

## Schedule

Recommended: run once per day (e.g. cron `0 7 * * *` for 07:00).

## Output

The agent produces a markdown file: `research-digest-YYYY-MM-DD.md` in the configured output directory.

## License

Apache-2.0
