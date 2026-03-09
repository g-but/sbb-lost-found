# Matching Service

Scores candidate found items for a given lost item. Placeholder scoring with category + text similarity.

## Endpoints
- `GET /health` — Service health
- `GET /api/matches/:lostItemId?limit=10` — Returns candidate found items with a simple score
- `POST /api/matches/:lostItemId/recompute` — Publishes `item_matched` event with candidates

## Config
- Postgres via `DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD` (or use Compose defaults)
- Redis via `REDIS_URL`
- `PORT` (default 3002)

## Smoke
- `scripts/smoke-matching.sh [base_url]` — health + simple matches request

## Future Work
- Add proper indexes for search (title/description)
- Integrate vector similarity (pgvector) when available
- Improve scoring (color/brand/time/location signals)

