# SBB Lost & Found

Real-time lost item recovery for Swiss public transport. Connects passengers with train staff while the item is still on board.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000.svg)](https://nextjs.org/)

## The Problem

1.2 million items lost annually in Swiss public transport. Current recovery rate: ~25%. The bottleneck is time -- by the time a passenger contacts the Fundburo, the train has moved on and the item is buried in a depot somewhere.

**Key insight**: items reported within 30 minutes have a >70% recovery rate. Items reported after 24 hours: ~25%. The entire architecture is built around collapsing that time gap.

## How It Works

| Step | Action | Time |
|------|--------|------|
| 1 | Passenger reports loss in-app | < 1 min |
| 2 | Staff receives real-time push notification | < 30 sec |
| 3 | Staff searches at next opportunity | During trip |
| 4 | Passenger gets status update | < 30 min |

Two interfaces: passenger app (`/`) and staff app (`/staff`). Open both side by side to see the real-time flow.

---

## Architecture

### Microservice Design

```
Frontend (Next.js 14, port 3000)
    │
    ├── Reporting Service (Express, port 3001) ── PostgreSQL
    │        │
    │        └── Redis pub/sub ── events ──> Notification Service (port 3003)
    │                                              │
    │                                              └── Socket.io ──> Staff browser
    ├── Matching Service (port 3002) [stub]
    └── API Gateway [stub]
```

Four services. Reporting is fully implemented. Matching and Notification are stubbed with defined interfaces -- the architecture is in place, the AI matching algorithm is next.

### SSOT Discipline

Every category of data lives in exactly one file:

| File | What It Owns |
|------|-------------|
| `lib/types.ts` | All TypeScript types and enums (266 lines) |
| `lib/config.ts` | Timing windows, validation limits, API URLs |
| `lib/labels.ts` | All German UI text (211 lines, i18n-ready) |
| `lib/schemas.ts` | Zod validation schemas (derived from types) |
| `lib/design-system.ts` | SBB official colors, spacing, typography |

Adding a new item category requires changes to 2 locations in `types.ts` -- `ITEM_CATEGORIES` enum and `ITEM_CATEGORY_CONFIG`. Forms, labels, validation, and display all auto-update.

### Real-Time Event Flow

```
Passenger submits report
    → Reporting Service persists to PostgreSQL
    → Publishes to Redis channel: "lost_item_created"
    → Notification Service receives event
    → Broadcasts via Socket.io
    → Staff browser receives via useWebSocket() hook
    → Notification card appears in real-time
```

WebSocket connection has auto-reconnect with exponential backoff (1s, 2s, 4s, 8s, 16s -- max 30s, max 5 attempts).

### Graceful Degradation

`useApiWithFallback()` hook -- tries the real backend, silently serves mock data from `lib/mock-data.ts` (368 lines) if unavailable. The shop directory keeps working. No error pages for infrastructure failures.

### Lost Item State Machine

```
reported → searching → found → returned
                    → not_found → closed
```

Three time windows drive priority:
- **Instant alert** (< 30 min): driver notification immediately
- **Priority** (< 2 hours): fast-track processing
- **Standard** (< 24 hours): regular queue

### SBB Design System

Official SBB corporate identity -- not approximated, implemented from their design specs. SBB Red (#EB0000) reserved for primary actions only. 4px spacing grid. Typography scale from 12-30px. All tokenized in `design-system.ts` and `tailwind.config.js` as `sbb-*` classes.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), TypeScript 5, Tailwind CSS 3 |
| Backend | Express.js 4, Node.js 18+ |
| Database | PostgreSQL 15, Redis 7 (pub/sub) |
| Real-time | Socket.io 4.7 |
| Auth | JWT, bcrypt |
| Validation | Zod (runtime), TypeScript (compile-time) |
| API Docs | OpenAPI 3.0 (auto-generated at `/docs`) |
| Deployment | Docker, Kubernetes manifests, Vercel (frontend) |

---

<details>
<summary><strong>Quick Start</strong></summary>

### Prerequisites

- Node.js 18+
- PostgreSQL 15 + Redis 7 (or use Docker)

### Setup

```bash
git clone https://github.com/g-but/sbb-lost-found.git
cd sbb-lost-found

# Option A: Docker (recommended)
docker compose up -d              # PostgreSQL + Redis + services
cd frontend && npm install && npm run dev

# Option B: Frontend only (mock data)
cd frontend && npm install && npm run dev
```

### Pages

| Path | Interface |
|------|-----------|
| `/` | Passenger app |
| `/staff` | Staff interface |
| `/demo` | Concept overview |

</details>

---

## Project Structure

```
frontend/
  app/
    page.tsx                # Passenger app
    staff/page.tsx          # Staff interface
    demo/page.tsx           # Concept overview
  components/
    passenger/              # TripCard, LostItemModal, QuickActions
    staff/                  # NotificationCard, StaffHeader, StatusBar
    ui/                     # ErrorBoundary, Toast, LoadingSpinner
  lib/
    types.ts                # SSOT: all types and enums
    config.ts               # SSOT: timing, validation, URLs
    labels.ts               # SSOT: all German UI text
    schemas.ts              # Zod validation (derived from types)
    design-system.ts        # SBB design tokens
    api.ts                  # API client with fallback
    mock-data.ts            # Demo data (368 lines)
    hooks/
      useApi.ts             # API hooks with graceful degradation
      useWebSocket.ts       # Real-time hooks with auto-reconnect
services/
  reporting/                # Lost item CRUD, Socket.io, Redis pub/sub
  matching/                 # Item matching algorithm [stub]
  notification/             # Push notifications [stub]
  api-gateway/              # Service orchestration [stub]
database/
  init/
    schema.sql              # 11 tables with indexes
    seed.sql                # Sample data
k8s/                        # Kubernetes deployment manifests
```

---

## License

MIT
