#!/usr/bin/env bash
set -euo pipefail

# Smoke test for API Gateway
# Usage: scripts/smoke-gateway.sh [BASE_URL]
# Default BASE_URL: http://localhost:3000

BASE_URL=${1:-http://localhost:3000}

pass() { echo "[PASS] $1"; }
fail() { echo "[FAIL] $1"; exit 1; }

# Health
if curl -fsS "$BASE_URL/healthz" | rg -q '"success"\s*:\s*true'; then
  pass "Aggregated health"
else
  fail "Aggregated health"
fi

# Proxy basic: forward reporting /health through /reporting/health
if curl -fsS "$BASE_URL/reporting/health" | rg -q '"status"\s*:\s*"healthy"'; then
  pass "Proxy reporting/health"
else
  fail "Proxy reporting/health"
fi

echo "Gateway smoke passed against $BASE_URL"

