#!/usr/bin/env bash
set -euo pipefail

# Smoke test for matching-service
# Usage: scripts/smoke-matching.sh [BASE_URL]
# Default BASE_URL: http://localhost:3002

BASE_URL=${1:-http://localhost:3002}

pass() { echo "[PASS] $1"; }
fail() { echo "[FAIL] $1"; exit 1; }

# Health
if curl -fsS "$BASE_URL/health" | rg -q '"status"\s*:\s*"healthy"'; then
  pass "Health endpoint"
else
  fail "Health endpoint"
fi

# Basic matches request with a dummy UUID (expect success:true and array)
if curl -fsS "$BASE_URL/api/matches/00000000-0000-0000-0000-000000000000?limit=1" | rg -q '"success"\s*:\s*true'; then
  pass "Matches endpoint"
else
  fail "Matches endpoint"
fi

echo "Matching smoke passed against $BASE_URL"

