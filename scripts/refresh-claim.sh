#!/usr/bin/env bash
set -euo pipefail

# Refresh or extend an existing claim lock ETA and log the refresh
# Usage: AGENT_NAME=Codex ETA=45m scripts/refresh-claim.sh <area>

if [[ $# -lt 1 ]]; then
  echo "Usage: AGENT_NAME=Codex ETA=45m $0 <area>" >&2
  exit 1
fi

REPO_ROOT=$(cd "$(dirname "$0")"/.. && pwd)
LOCK_DIR="$REPO_ROOT/.agents/locks"
AREA="$1"
AGENT="${AGENT_NAME:-Codex}"
ETA_NEW="${ETA:-30m}"
LOCK_NAME=$(echo "$AREA" | sed 's#[^A-Za-z0-9_-]#_#g')
LOCK_FILE="$LOCK_DIR/${LOCK_NAME}.lock"

if [[ ! -f "$LOCK_FILE" ]]; then
  echo "No existing lock for area: $AREA" >&2
  exit 2
fi

touch "$LOCK_FILE"
sed -i "/^eta=/c\\eta=$ETA_NEW" "$LOCK_FILE" || true
sed -i "/^agent=/c\\agent=$AGENT" "$LOCK_FILE" || true

"$REPO_ROOT/scripts/agent-log.sh" "REFRESH: $AREA claim extended" -c "Claim: $AREA" -k "eta=$ETA_NEW" -n "Lock: .agents/locks/${LOCK_NAME}.lock"
echo "Refreshed: $AREA to ETA=$ETA_NEW"

