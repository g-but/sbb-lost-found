#!/usr/bin/env bash
set -euo pipefail

# Agent Coordination System Setup
# Usage: ./setup-agent-coordination.sh [project-name] [project-description]

PROJECT_NAME=${1:-"My Project"}
PROJECT_DESC=${2:-"Multi-agent development project"}
TARGET_DIR=${3:-$(pwd)}

echo "🤖 Setting up Agent Coordination System"
echo "======================================"
echo "Project: $PROJECT_NAME"
echo "Description: $PROJECT_DESC"
echo "Target: $TARGET_DIR"
echo ""

cd "$TARGET_DIR"

# Create directory structure
mkdir -p scripts .agents/locks

# Create AGENTS_SYNC.md
cat > AGENTS_SYNC.md << 'EOF'
# AGENTS_SYNC.md

Single shared activity log for all coding agents (Codex, Claude Code, Cursor, etc.).

How to use
- Append new entries at the bottom in reverse‑chronological order (newest last).
- Keep entries short, factual, and include paths changed.
- Include timestamp (UTC), agent name, and any asks for others.
- Do not modify previous entries; this is an append‑only journal.

Entry template
```
## 2025-09-28T15:50:00Z — Agent: AgentName
- Summary: One‑line description.
- Changes: <paths>
- Commands: <key commands + outcomes>
- Notes/Asks: <questions, blockers, next steps>
```

---

## $(date -u +%Y-%m-%dT%H:%M:%SZ) — Agent: Setup
- Summary: Initialized agent coordination system
- Changes: AGENTS_SYNC.md, AGENTS.md, TASK_QUEUE.md, scripts/
- Commands: ./setup-agent-coordination.sh "$PROJECT_NAME"
- Notes/Asks: Ready for multi-agent collaboration!

EOF

# Create AGENTS.md
cat > AGENTS.md << EOF
# AGENTS.md (Multi-Model Development)

Operational guide for working on $PROJECT_NAME with multiple AI coding agents including Cursor IDE models.

## Coordination
- Shared activity log: \`AGENTS_SYNC.md\` (append-only; actions, commands, results).
- Task list: \`TASK_QUEUE.md\` (prioritized; update owner/status inline).
- Claims/locks: use \`scripts/claim.sh <area> "summary"\` to avoid collisions.
- Smoke checks: run \`scripts/smoke.sh [base_url]\` and include output in log entries.
- Keep entries concise and timestamped; do not rewrite history.

## 🤖 Available AI Agents

This project leverages multiple AI coding models through Cursor IDE for different specialized tasks:

### **Cursor Models Available**
- **Code-Supernova-1-Million** - Advanced reasoning, massive context window, next-gen Claude capabilities
- **Grok Code** - Fast, practical coding with real-time web access and current knowledge
- **Claude Code** - Balanced coding assistant with strong TypeScript/Node.js expertise
- **Other Models** - Cursor continuously updates with latest models (GPT-4, etc.)

### **Agent Selection Guide**
- **Complex Architecture & System Design** → Code-Supernova-1-Million (massive context)
- **API Integration & Database Work** → Claude Code (TypeScript expertise)
- **Quick Fixes & Current Tech Updates** → Grok Code (real-time knowledge)
- **Frontend & UI Development** → Choose model with strong web dev capabilities
- **DevOps & Infrastructure** → Model with strong shell/systems knowledge

### **Handoff Protocol**
- Use \`make handoff AGENT=<model> NEXT="<description>" BASE_URL=<url>\`
- Include current context, recent changes, and next steps in handoff
- Update TASK_QUEUE.md with new owner and ETA
- Test handoffs work smoothly between agents

## Project Overview
$PROJECT_DESC

## Core Commands (run in repo root)
- \`make ho MESSAGE="handoff message"\` - Quick handoff
- \`make model-select TASK="task description"\` - Get model recommendation
- \`make claim AGENT=<model> AREA="area" SUMMARY="summary" ETA="30m"\` - Claim task
- \`scripts/smoke.sh\` - Health checks (customize for your project)

**Cursor Integration:**
- Launch Cursor on this workspace and select desired model from the available options
- Models auto-detect project structure and can seamlessly take over tasks
- Use "Apply" feature to implement changes suggested by any model
- Models have access to full workspace context and can run terminal commands

## Contributing With AI Agents
- Prefer targeted builds and minimal diffs
- Use "Apply" feature in Cursor to implement changes suggested by any model
- Run tests and linting before finishing
- Update this file when behavior or commands change
- Leverage each model's strengths:
  - **Code-Supernova-1-Million**: Complex multi-step tasks, architecture decisions
  - **Grok Code**: Quick implementations, current best practices, real-time updates
  - **Claude Code**: TypeScript expertise, clean code patterns, documentation

EOF

# Create TASK_QUEUE.md
cat > TASK_QUEUE.md << EOF
# TASK_QUEUE.md

Prioritized task list for $PROJECT_NAME multi-agent coordination.

## Priority 1 (High)
- [ ] **Setup Initial Architecture** (Owner: TBD, ETA: TBD)
  - Description: Define project structure and core components

## Priority 2 (Medium)
- [ ] **Implement Core Features** (Owner: TBD, ETA: TBD)
  - Description: Build main functionality

## Priority 3 (Low)
- [ ] **Polish & Documentation** (Owner: TBD, ETA: TBD)
  - Description: Refine UX and add comprehensive docs

## Completed ✅
- [x] **Agent Coordination Setup** (Owner: Setup Script, Completed: $(date -u +%Y-%m-%dT%H:%M:%SZ))

---

## Instructions
1. Claim tasks with: \`scripts/claim.sh "area" "summary"\`
2. Update status when working: change \`[ ]\` to \`[WIP]\`
3. Mark complete: change to \`[x]\` and move to Completed section
4. Add new tasks as needed, maintain priority order

EOF

# Create basic Makefile
cat > Makefile << 'EOF'
SHELL := /bin/bash

.PHONY: help ho handoff claim model-select smoke agent-log

help:
	@echo "Agent Coordination Commands:"
	@echo "  make ho MESSAGE='...'         - Quick handoff"
	@echo "  make handoff AGENT=... NEXT=... - Structured handoff"
	@echo "  make claim AGENT=... AREA=... SUMMARY=... ETA=... - Claim task"
	@echo "  make model-select TASK='...'  - Get model recommendation"
	@echo "  make smoke                    - Run health checks"

ho:
	@./scripts/ho.sh "$(MESSAGE)"

handoff:
	@AGENT_NAME="$(AGENT)" NEXT="$(NEXT)" ./scripts/handoff.sh

claim:
	@AGENT_NAME="$(AGENT)" ETA="$(ETA)" ./scripts/claim.sh "$(AREA)" "$(SUMMARY)"

model-select:
	@./scripts/model-selector.sh "$(TASK)"

smoke:
	@./scripts/smoke.sh

agent-log:
	@AGENT_NAME="$(AGENT)" ./scripts/agent-log.sh "$(SUMMARY)" -c "$(CHANGES)" -k "$(COMMANDS)" -n "$(NOTES)"

EOF

chmod +x Makefile

echo "✅ Agent coordination system setup complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Customize TASK_QUEUE.md with your actual project tasks"
echo "2. Update AGENTS.md with project-specific information"
echo "3. Create project-specific scripts/smoke.sh for health checks"
echo "4. Start collaborating: make ho MESSAGE='Ready to start!'"
echo ""
echo "🤖 Available commands:"
echo "  make ho MESSAGE='message'           - Quick handoff"
echo "  make model-select TASK='task desc'  - Get model recommendation"
echo "  make claim AGENT=model AREA=area SUMMARY=summary ETA=time"
echo ""