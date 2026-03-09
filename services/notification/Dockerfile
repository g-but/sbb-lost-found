FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY services/notification/package*.json ./services/notification/
COPY shared/types/package*.json ./shared/types/

# Install dependencies
RUN npm install --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build shared types first
RUN cd shared/types && npm run build

# Build the service
RUN cd services/notification && npm run build

# Production image, copy all the files and run the service
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3003

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/services/notification/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/services/notification/package*.json ./

# Create logs directory
RUN mkdir -p logs && chown nodejs:nodejs logs

USER nodejs

EXPOSE 3003

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3003/health', (res) => { \
    if (res.statusCode === 200) { process.exit(0); } else { process.exit(1); } \
  }).on('error', () => { process.exit(1); });"

CMD ["node", "dist/index.js"]