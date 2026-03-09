# API Gateway

Entry point that proxies requests to internal services and aggregates health status.

## Endpoints
- `GET /health` — Gateway health
- `GET /healthz` — Aggregated health for reporting/matching/notification
- `GET /me/recent-trips` — Dev-only mock recent trips for report prefill (returns last 3 sample trips)
- Proxy routes (path prefix stripped when forwarding):
  - `/reporting/*` → Reporting Service (default http://localhost:3001)
  - `/matching/*` → Matching Service (default http://localhost:3002)
  - `/notifications/*` → Notification Service (default http://localhost:3003)

## Config
- `PORT` (default 3000)
- `REPORTING_SERVICE_URL` (default `http://localhost:3001`)
- `MATCHING_SERVICE_URL` (default `http://localhost:3002`)
- `NOTIFICATION_SERVICE_URL` (default `http://localhost:3003`)

## Smoke
- `scripts/smoke-gateway.sh [base_url]`
  - Verifies `/healthz` and proxied `/reporting/health`

## Dev Utilities
- `scripts/ws-client.js [url]` — Connects to the notification Socket.IO server to observe events

## Notes
- Proxy implemented with native `fetch` to avoid extra dependencies.
- Hop-by-hop headers like `host` and `content-length` are not forwarded.
- JSON bodies are forwarded when `Content-Type: application/json`.
