# TASK_QUEUE.md

Shared, prioritized task list for agents. Append new tasks at the bottom; mark status updates inline.

Format
- [ ] Title — Owner: <Codex/Claude/Unassigned> — Priority: P1/P2/P3 — Notes

Queue
- [x] JWT token generator for local testing — Owner: Claude — Priority: P1 — small script + doc (DONE)
- [x] Notification service scaffolding (WebSocket consumer) — Owner: Codex — Priority: P2 — subscribe to Redis events, expose minimal endpoints (DONE)
- [x] Matching service scaffolding (search + placeholder scoring) — Owner: Codex — Priority: P2 — set up API + DB access; simple rule-based match (DONE)
- [x] API Gateway routing (proxy to services) — Owner: Codex — Priority: P2 — wire basic routes, add health aggregation (INITIAL SCAFFOLD DONE)
- [x] Add CI-local smoke target (make smoke-all) — Owner: Codex — Priority: P3 — consolidated smokes for reporting/matching/notification
 - [ ] API Gateway routing + health aggregation — Owner: Cursor — Priority: P1 — expose `/healthz` and proxy `/reporting`, `/matching`, `/notifications`
 - [ ] Frontend MVP (report lost item + view status) — Owner: Cursor — Priority: P2 — minimal pages calling reporting/search endpoints
