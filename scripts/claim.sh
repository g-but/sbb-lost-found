#!/usr/bin/env bash
set -euo pipefail

# Claim an area to avoid collisions and append an intent entry to AGENTS_SYNC.md
# Usage: AGENT_NAME=Codex ETA="30m" scripts/claim.sh <area> "Short intent summary"

if [[ $# -lt 2 ]]; then
  echo "Usage: AGENT_NAME=Codex ETA=30m $0 <area> \"Short intent summary\"" >&2
  exit 1
fi

REPO_ROOT=$(cd "$(dirname "$0")"/.. && pwd)
LOCK_DIR="$REPO_ROOT/.agents/locks"
mkdir -p "$LOCK_DIR"

AREA="$1"; shift
SUMMARY="$*"
AGENT="${AGENT_NAME:-Codex}"
ETA="${ETA:-30m}"

LOCK_NAME=$(echo "$AREA" | sed 's#[^A-Za-z0-9_-]#_#g')
LOCK_FILE="$LOCK_DIR/${LOCK_NAME}.lock"

if [[ -f "$LOCK_FILE" ]]; then
  echo "Area already claimed: $AREA (lock: $LOCK_FILE)" >&2
  cat "$LOCK_FILE" >&2 || true
  exit 2
fi

{
  echo "agent=$AGENT"
  echo "area=$AREA"
  echo "eta=$ETA"
  echo "claimed_at=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
} > "$LOCK_FILE"

CHANGES="Claim: $AREA (ETA $ETA)"
COMMANDS=""
NOTES="Lock file: .agents/locks/${LOCK_NAME}.lock"

"$REPO_ROOT/scripts/agent-log.sh" "INTENT: $SUMMARY" -c "$CHANGES" -k "$COMMANDS" -n "$NOTES"

echo "Claimed: $AREA by $AGENT"

