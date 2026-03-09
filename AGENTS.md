# AGENTS.md (Multi-Model Development)

Operational guide for working on this monorepo with multiple AI coding agents including Cursor IDE models.

## Coordination
- Shared activity log: `AGENTS_SYNC.md` (append-only; actions, commands, results).
- Task list: `TASK_QUEUE.md` (prioritized; update owner/status inline).
- Claims/locks: use `scripts/claim.sh <area> "summary"` to avoid collisions.
- Smoke checks: run `scripts/smoke.sh [base_url]` and include output in log entries.
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
- Use `make handoff AGENT=<model> NEXT="<description>" BASE_URL=<url>`
- Include current context, recent changes, and next steps in handoff
- Update TASK_QUEUE.md with new owner and ETA
- Test handoffs work smoothly between agents

## Overview
- Microservices monorepo (Node.js/TypeScript) with npm workspaces.
- Event‑driven via Redis pub/sub; PostgreSQL as primary DB.
- Real‑time updates with Socket.IO; OpenAPI docs via Swagger UI.

Structure
- `services/`
  - `api-gateway/` (port 3000)
  - `reporting/` (port 3001)
  - `matching/` (port 3002)
  - `notification/` (port 3003)
- `shared/`
  - `types/` (TypeScript types)
  - `utils/` (shared utilities, if present)
- `database/` init assets for local Postgres
- `k8s/` manifests

## Prerequisites
- Node >= 18, npm >= 9
- Docker + Docker Compose (for full stack)
- Local Postgres and Redis OR use Compose services

## Core Commands (run in repo root)
- `npm install`: Install all workspace deps
- `npm run build`: Build all workspaces
- `npm run dev`: `docker-compose up -d` then start all workspaces in dev
- `npm test`: Run tests across workspaces (where present)
- `npm run lint`: Lint across workspaces (where configured)
- `npm run typecheck`: TypeScript `--noEmit` across workspaces
- `npm run clean`: Remove build artifacts per workspace

Workspace‑scoped (examples)
- `npm run build --workspace=@sbb-lost-found/types`
- `npm run build --workspace=@sbb-lost-found/reporting-service`

Docker/K8s
- `npm run docker:build` | `npm run docker:up` | `npm run docker:down`
- `npm run k8s:deploy` (expects kubectl context configured)

Agent Tools
- `make agent-log SUMMARY="..." CHANGES="..." COMMANDS="..." NOTES="..." AGENT=<model-name>`
- `scripts/claim.sh <area> "Short intent summary"` (AGENT_NAME/ETA env vars)
- `scripts/smoke.sh [base_url]` (defaults to `http://localhost:3001`)
- `make jwt JWT_SECRET=... PAYLOAD='{"id":"u1","email":"u1@example.com"}' EXPIRES=3600`
- `make handoff AGENT=<model> NEXT="short next steps" BASE_URL=http://localhost:3001`
- `make refresh-claim AGENT=<model> AREA="services/reporting" ETA=45m`

**Cursor Integration:**
- Launch Cursor on this workspace and select desired model from the available options
- Models auto-detect project structure and can seamlessly take over tasks
- Use "Apply" feature to implement changes suggested by any model
- Models have access to full workspace context and can run terminal commands

JWT Testing
- Generate a token with the same `JWT_SECRET` used by the service.
- Example usage:
  - `JWT_SECRET=your-secret ./scripts/generate-jwt.js`
  - `make jwt JWT_SECRET=your-secret`

## Environment
Common vars
- `PORT`: Service port
- `CORS_ORIGIN`: Allowed origin(s), default `*`
- `JWT_SECRET`: For auth middleware (dev default present)
- Postgres (Reporting service expects discrete vars)
  - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- Redis
  - `REDIS_URL` (e.g., `redis://localhost:6379`)

Notes
- `docker-compose.yml` sets a `DATABASE_URL` for containers, but the reporting service code uses discrete `DB_*` vars. For local runs outside Compose, export `DB_*` vars.
- Logging writes to `logs/` in some services. Ensure the folder exists or prefer Console transport in dev.

## Local Development Flows
Option A: Full stack via Compose
- `npm run docker:up`
- Access: API Gateway `http://localhost:3000`, Reporting `http://localhost:3001` (docs at `/docs`)

Option B: Run reporting service only
- Start Postgres + Redis locally (or via Compose) 
- Export env: `DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, REDIS_URL, PORT`
- Build deps: `npm run build --workspace=@sbb-lost-found/types`
- Build service: `npm run build --workspace=@sbb-lost-found/reporting-service`
- Dev: `npm run dev --workspace=@sbb-lost-found/reporting-service`
- Health: `GET /health`, Docs: `GET /docs`

## Coding Standards
- TypeScript strict; Node ESM/CJS as per tsconfig per service
- Linting with ESLint where configured; formatting via Prettier if present
- Prefer small, focused changes; update docs and types in `shared/` when APIs evolve
- Keep services isolated; shared contracts belong in `shared/types`

## Testing
- Framework: Jest for services (where configured)
- Conventions
  - Unit tests near source or in `__tests__` (service preference)
  - Name: `*.test.ts` or `*.spec.ts`
- Commands
  - `npm test --workspace=@sbb-lost-found/reporting-service`
- Add regression tests for fixed bugs; keep tests fast and isolated

## Database
- Local dev DB initialized by Compose via `database/init`
- Reporting service scripts
  - `npm run db:migrate --workspace=services/reporting`
  - `npm run db:seed --workspace=services/reporting`
- Use proper indexing for new queries (follow existing schema patterns)

## Common Tasks
- Add route (Reporting)
  - Define validation in `src/middleware/validation.ts`
  - Implement controller in `src/controllers`
  - Wire route in `src/routes`
  - Update OpenAPI annotations and verify `/docs`
- Add event
  - Publish via `redisPublisher.publish(channel, payload)`
  - Subscribe in service startup and broadcast via Socket.IO as needed
- Extend data contracts
  - Update `shared/types/src/index.ts`
  - Rebuild `@sbb-lost-found/types`, then services

## Troubleshooting
- TypeScript build breaks in reporting
  - Ensure `@sbb-lost-found/types` is built first
  - Redis subscribe signature: use array of channels and typed callback
- DB/Redis connection issues
  - Verify `DB_*` and `REDIS_URL`; check Compose health
- Logs directory
  - Create `logs/` or set `NODE_ENV!=production` to prefer Console transport
- Port conflicts
  - Adjust `PORT` per service or stop conflicting processes

## Security & Ops
- JWT required on protected endpoints; rotate secrets for non‑dev
- Rate limiting via Redis middleware per route
- Follow OWASP/ASVS for changes; avoid logging PII

## Contributing With AI Agents
- Prefer targeted builds (`--workspace`) and minimal diffs
- Use "Apply" feature in Cursor to implement changes suggested by any model
- Run typecheck and (where configured) lint before finishing
- Update this file when behavior or commands change
- Leverage each model's strengths:
  - **Code-Supernova-1-Million**: Complex multi-step tasks, architecture decisions
  - **Grok Code**: Quick implementations, current best practices, real-time updates
  - **Claude Code**: TypeScript expertise, clean code patterns, documentation
