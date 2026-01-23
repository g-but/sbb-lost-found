#!/usr/bin/env bash
set -euo pipefail

# Append a standardized handoff entry to AGENTS_SYNC.md
# Captures smoke results, env context, locks, and next steps
# Usage: AGENT_NAME=Codex NEXT="short next steps" scripts/handoff.sh [BASE_URL]

REPO_ROOT=$(cd "$(dirname "$0")"/.. && pwd)
BASE_URL=${1:-http://localhost:3001}
AGENT="${AGENT_NAME:-Codex}"
NEXT="${NEXT:-"Continue priority tasks as per TASK_QUEUE.md"}"

SMOKE_OUT=$( set +e; "$REPO_ROOT/scripts/smoke.sh" "$BASE_URL" 2>&1; echo "__RC:$?" )
RC=$(echo "$SMOKE_OUT" | rg -o "__RC:(\d+)" -r "$1" | tail -n1 || true)
LOCKS="None"
if [[ -d "$REPO_ROOT/.agents/locks" ]] && ls -1 "$REPO_ROOT/.agents/locks"/*.lock >/dev/null 2>&1; then
  LOCKS=$( ( echo "Active locks:"; for f in "$REPO_ROOT/.agents/locks"/*.lock; do echo "- $(basename "$f"): $(tr '\n' ' ' < "$f")"; done ) )
fi

ENV_SUMMARY=$(cat <<ENV
PORT=${PORT:-3001}
DATABASE_URL=${DATABASE_URL:-}
DB_HOST=${DB_HOST:-}
DB_PORT=${DB_PORT:-}
DB_NAME=${DB_NAME:-}
REDIS_URL=${REDIS_URL:-}
JWT_SECRET=${JWT_SECRET:+set}
ENV)

SUMMARY="Handoff: smoke RC=${RC:-?}; base=${BASE_URL}"
CHANGES="N/A (handoff)"
COMMANDS=$(printf '%s' "$SMOKE_OUT" | sed 's/__RC:.*$//')
NOTES=$(cat <<NOTES
Env:\n$ENV_SUMMARY\n$LOCKS\nNext: $NEXT
NOTES
)

"$REPO_ROOT/scripts/agent-log.sh" "$SUMMARY" -c "$CHANGES" -k "$COMMANDS" -n "$NOTES"
echo "Handoff logged."

