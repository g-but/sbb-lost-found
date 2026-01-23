#!/usr/bin/env bash
set -euo pipefail

# Quick handoff command - alias for handoff.sh
# Usage: ho [message] [base_url]
# Example: ho "Completed JWT testing, ready for next phase"

REPO_ROOT=$(cd "$(dirname "$0")"/.. && pwd)
MESSAGE=${1:-"Handoff to next agent"}
BASE_URL=${2:-http://localhost:3001}

# Set default agent name if not provided
export AGENT_NAME="${AGENT_NAME:-Claude Code}"
export NEXT="${MESSAGE}"

echo "🔄 Initiating handoff..."
bash "$REPO_ROOT/scripts/handoff.sh" "$BASE_URL"
echo "✅ Handoff complete. Ready for next agent."