# Notification Service

Real-time relay of Redis pub/sub events to WebSocket clients with simple REST utilities.

## Endpoints
- `GET /health`: Service health.
- `GET /api/notifications/recent?limit=50`: Last events (diagnostics).
- `POST /api/notifications`:
  - Body: `{ "channel": "driver_notification", "payload": { ... } }`
  - Publishes payload to Redis channel.

## WebSocket
- Connect to `ws://localhost:3003` via Socket.IO client.
- Listen to channels: `driver_notification`, `lost_item_created`, `lost_item_status_updated`.

Example (Node):
```
const { io } = require('socket.io-client');
const socket = io('http://localhost:3003');
socket.on('connect', () => console.log('WS connected'));
for (const ch of ['driver_notification','lost_item_created','lost_item_status_updated']) {
  socket.on(ch, (evt) => console.log('event', ch, evt));
}
```

## Smoke Test
- `scripts/smoke-notification.sh [base_url]`
- Publishes a test `driver_notification` and verifies it appears in `/recent`.

## Docker Compose
- Service defined in `docker-compose.yml` as `notification-service` (port 3003).
- Ensure Redis is reachable (e.g., `REDIS_URL=redis://redis:6379` in Compose, or localhost in dev).

