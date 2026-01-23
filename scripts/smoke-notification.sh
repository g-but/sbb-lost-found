#!/usr/bin/env bash
set -euo pipefail

# Smoke test for notification-service
# Usage: scripts/smoke-notification.sh [BASE_URL]
# Default BASE_URL: http://localhost:3003

BASE_URL=${1:-http://localhost:3003}

pass() { echo "[PASS] $1"; }
fail() { echo "[FAIL] $1"; exit 1; }

# Health
if curl -fsS "$BASE_URL/health" | rg -q '"status"\s*:\s*"healthy"'; then
  pass "Health endpoint"
else
  fail "Health endpoint"
fi

# Publish a test event
PAYLOAD='{ "type":"test_notification", "message":"hello from smoke", "ts":"'"$(date -u +%FT%TZ)"'" }'
if curl -fsS -X POST "$BASE_URL/api/notifications" \
  -H 'Content-Type: application/json' \
  -d '{"channel":"driver_notification","payload":'"$PAYLOAD"'}' | rg -q '"success"\s*:\s*true'; then
  pass "Publish event"
else
  fail "Publish event"
fi

sleep 1

# Check recent
if curl -fsS "$BASE_URL/api/notifications/recent?limit=5" | rg -q '"channel"\s*:\s*"driver_notification"'; then
  pass "Recent shows published event"
else
  fail "Recent shows published event"
fi

echo "Notification smoke passed against $BASE_URL"

