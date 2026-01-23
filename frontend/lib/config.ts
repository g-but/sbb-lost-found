/**
 * Application Configuration
 * Single Source of Truth for runtime config values
 *
 * NOTE: Design tokens (colors, spacing, typography) are in:
 * - tailwind.config.js (build-time, Tailwind classes)
 * - lib/design-system.ts (runtime reference if needed)
 */

export const config = {
  api: {
    // API Gateway proxies to all services
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    // Notification service for WebSocket
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3003',
    timeout: 10000,
  },

  // Time windows for lost item reporting
  reporting: {
    // Reports within this window get instant driver notification
    instantAlertWindowMinutes: 30,
    // Reports within this window get priority handling
    priorityWindowHours: 2,
    // Reports within this window go to standard queue
    standardWindowHours: 24,
  },

  // Demo mode configuration
  demo: {
    enabled: process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || true,
    mockDelay: 1500,
    autoNotify: true,
  },

  // Supported languages
  languages: ['de', 'fr', 'it', 'en'] as const,
  defaultLanguage: 'de' as const,

  // UI timing constants (ms)
  timing: {
    toastDuration: 4000,
    successMessageDelay: 2000,
    demoNotificationDelay: 5000,
  },

  // Input validation limits
  validation: {
    description: {
      minLength: 3,
      maxLength: 500,
    },
    notes: {
      maxLength: 1000,
    },
  },
} as const;

export type Config = typeof config;
export type Language = (typeof config.languages)[number];
