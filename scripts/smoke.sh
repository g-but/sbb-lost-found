#!/usr/bin/env bash
set -euo pipefail

# Simple smoke test for the reporting service
# Usage: scripts/smoke.sh [BASE_URL]
# Default BASE_URL: http://localhost:3001

BASE_URL=${1:-http://localhost:3001}

pass() { echo "[PASS] $1"; }
fail() { echo "[FAIL] $1"; exit 1; }

# Health
if curl -fsS "$BASE_URL/health" | rg -q '"status"\s*:\s*"healthy"'; then
  pass "Health endpoint"
else
  fail "Health endpoint"
fi

# Docs
if curl -fsS "$BASE_URL/docs" | rg -qi '<!DOCTYPE html'; then
  pass "Docs endpoint"
else
  fail "Docs endpoint"
fi

# Public search
if curl -fsS "$BASE_URL/api/lost-items/search?limit=1" | rg -q '"success"\s*:\s*true'; then
  pass "Search endpoint"
else
  fail "Search endpoint"
fi

echo "Smoke tests passed against $BASE_URL"

