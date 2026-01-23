/**
 * Application Configuration
 * Single Source of Truth for all config values
 */

export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
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
    enabled: process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || true, // Enable for demo
    mockDelay: 1500, // Simulate network delay in ms
    autoNotify: true, // Auto-trigger notifications for demo
  },

  // Supported languages
  languages: ['de', 'fr', 'it', 'en'] as const,
  defaultLanguage: 'de' as const,

  // SBB Design System tokens
  design: {
    colors: {
      red: '#EB0000',
      red125: '#C60018',
      red150: '#A20013',
      charcoal: '#212121',
      iron: '#444444',
      granite: '#686868',
      smoke: '#8D8D8D',
      cloud: '#E5E5E5',
      milk: '#F6F6F6',
      white: '#FFFFFF',
      blue: '#2D327D',
      success: '#00973B',
      warning: '#FFAB00',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 16,
      xl: 24,
    },
  },
} as const;

export type Config = typeof config;
export type Language = typeof config.languages[number];
