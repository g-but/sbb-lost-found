#!/usr/bin/env bash
set -euo pipefail

# Run smoke tests for all services (reporting, matching, notification)
# Usage: scripts/smoke-all.sh [REPORTING_URL] [MATCHING_URL] [NOTIFICATION_URL]

R_URL=${1:-http://localhost:3001}
M_URL=${2:-http://localhost:3002}
N_URL=${3:-http://localhost:3003}

echo "== Reporting ($R_URL) =="
"$(dirname "$0")"/smoke.sh "$R_URL"

echo
echo "== Matching ($M_URL) =="
"$(dirname "$0")"/smoke-matching.sh "$M_URL"

echo
echo "== Notification ($N_URL) =="
"$(dirname "$0")"/smoke-notification.sh "$N_URL"

echo
echo "All smokes passed"

