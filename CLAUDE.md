# SBB Lost & Found

@~/.claude/CLAUDE.md

---

## Overview

Enterprise-grade lost and found system for SBB (Swiss Federal Railways) built with a microservices architecture. The system handles millions of daily trips across Switzerland's public transport network with 99.9% uptime requirements and sub-second response times.

### Key Features
- Microservices architecture with TypeScript/Node.js
- Event-driven design using Redis message queues
- PostgreSQL database optimized for scale
- Real-time WebSocket notifications
- AI-powered item matching
- Integration with SBB mobile app
- Multi-language support (German, French, Italian, English)

## Agent Coordination
- Use the shared log `AGENTS_SYNC.md` in the repo root to record:
  - What you changed, why, and where (paths).
  - Commands run and results (builds/tests/migrations).
  - Open questions or follow-ups for other agents.
- Append new entries; do not modify past entries. Keep it concise.

## Development Commands

### Local Development
```bash
# Start all services with Docker Compose
npm run dev

# Install dependencies for all workspaces
npm install

# Build all services
npm run build

# Run tests across all services
npm run test

# Lint all code
npm run lint

# Type check all services
npm run typecheck

# Clean build artifacts
npm run clean
```

### Database Operations
```bash
# Run database migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### Docker Operations
```bash
# Build all Docker images
npm run docker:build

# Start services with Docker Compose
npm run docker:up

# Stop all services
npm run docker:down
```

### Kubernetes Deployment
```bash
# Deploy to Kubernetes cluster
npm run k8s:deploy

# Apply specific manifests
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/reporting-service.yaml
```

## Architecture

### Microservices Structure
```
services/
├── reporting/          # Core lost/found item reporting (Port 3001)
├── matching/           # AI-powered item matching (Port 3002)
├── notification/       # Real-time notifications (Port 3003)
└── api-gateway/        # External API gateway (Port 3000)

shared/
├── types/              # Shared TypeScript definitions
└── utils/              # Common utilities
```

### Core Services

#### Reporting Service (Port 3001)
- Lost item registration and management
- Found item processing
- Full-text search with PostgreSQL
- RESTful API with OpenAPI documentation
- Real-time WebSocket notifications

#### Database Schema
- **lost_items**: Lost item reports with full-text search
- **found_items**: Found item reports with location tracking
- **matches**: AI-generated matches between lost/found items
- **trips**: SBB trip data with vehicle and route information
- **users**: SBB mobile app user integration
- **notifications**: Multi-channel notification system

#### Key Tables
- `vehicles`: Transport units (trains, buses, trams) with IDs like "BN N71", "B704"
- `routes`: Trip routes like "Zürich, Central → Zürich, Loorenstrasse"
- `driver_notifications`: Real-time alerts to vehicle operators

### Event-Driven Architecture
- Redis pub/sub for real-time events
- WebSocket connections for live updates
- Event types: `lost_item_created`, `item_matched`, `driver_notification`

### Security & Performance
- JWT authentication with SBB user integration
- Rate limiting per endpoint
- Database connection pooling
- Horizontal auto-scaling with Kubernetes HPA
- Health checks and monitoring

### Deployment
- Multi-stage Docker builds for production optimization
- Kubernetes manifests with auto-scaling
- PostgreSQL with persistent volumes
- Redis for caching and message queues
- Ingress with SSL termination

## Development Workflow

1. **Service Development**: Each service is a separate npm workspace
2. **Shared Types**: Common TypeScript definitions in `shared/types`
3. **Database**: PostgreSQL with migrations and proper indexing
4. **Testing**: Run `npm test` for comprehensive test coverage
5. **Deployment**: Use `npm run k8s:deploy` for Kubernetes deployment

## Service URLs
- API Gateway: http://localhost:3000
- Reporting Service: http://localhost:3001
- Matching Service: http://localhost:3002
- Notification Service: http://localhost:3003
- API Documentation: http://localhost:3001/docs

---

**Last Updated**: 2026-01-23
