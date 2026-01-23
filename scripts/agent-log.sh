#!/usr/bin/env bash
# Append a structured entry to AGENTS_SYNC.md
set -euo pipefail

REPO_ROOT=$(cd "$(dirname "$0")"/.. && pwd)
LOG_FILE="$REPO_ROOT/AGENTS_SYNC.md"
AGENT_NAME=${AGENT_NAME:-Codex}
TIME_UTC=$(date -u +%Y-%m-%dT%H:%M:%SZ)

usage() {
  echo "Usage: AGENT_NAME=Codex scripts/agent-log.sh \"Summary line\" \n  -c 'Changed paths or bullets' \n  -k 'Commands and outcomes' \n  -n 'Notes/Asks'" >&2
}

SUMMARY=""
CHANGES=""
COMMANDS=""
NOTES=""

if [[ $# -lt 1 ]]; then
  usage; exit 1
fi
SUMMARY=$1; shift || true

while getopts ":c:k:n:" opt; do
  case $opt in
    c) CHANGES=$OPTARG ;;
    k) COMMANDS=$OPTARG ;;
    n) NOTES=$OPTARG ;;
    *) usage; exit 1 ;;
  esac
done

{
  echo
  echo "## ${TIME_UTC} — Agent: ${AGENT_NAME}"
  echo "- Summary: ${SUMMARY}"
  if [[ -n "$CHANGES" ]]; then
    echo "- Changes: ${CHANGES}"
  else
    echo "- Changes: N/A"
  fi
  if [[ -n "$COMMANDS" ]]; then
    echo "- Commands: ${COMMANDS}"
  else
    echo "- Commands: N/A"
  fi
  if [[ -n "$NOTES" ]]; then
    echo "- Notes/Asks: ${NOTES}"
  fi
} >> "$LOG_FILE"

echo "Appended entry to $LOG_FILE"
