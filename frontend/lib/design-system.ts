/**
 * SBB Design System - Single Source of Truth
 *
 * All design tokens are defined HERE and derived elsewhere.
 * Based on official SBB digital design system: https://digital.sbb.ch
 *
 * DO NOT define colors, spacing, or typography elsewhere.
 */

// ============================================================================
// Official SBB Color Palette
// Source: https://digital.sbb.ch/en/foundation/colors/base-colors/
// ============================================================================

export const SBB_COLORS = {
  // Primary
  red: '#EB0000',
  'red-125': '#C60018',
  'red-150': '#A20013',

  // Neutrals
  white: '#FFFFFF',
  milk: '#F6F6F6',
  cloud: '#E5E5E5',
  silver: '#DCDCDC',
  cement: '#BDBDBD',
  smoke: '#8D8D8D',
  granite: '#686868',
  iron: '#444444',
  charcoal: '#212121',

  // Functional
  blue: '#2D327D',
  success: '#00973B',
  warning: '#FFAB00',

  // Extended palette for gradients (use sparingly)
  gradients: {
    urgentStart: '#FF5722',
    urgentEnd: '#FF8A65',
    activeStart: '#1976D2',
    activeEnd: '#42A5F5',
  },
} as const;

// ============================================================================
// Spacing (4px base grid)
// ============================================================================

export const SBB_SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const;

// ============================================================================
// Border Radius
// ============================================================================

export const SBB_RADIUS = {
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
} as const;

// ============================================================================
// Typography Scale
// ============================================================================

export const SBB_TYPOGRAPHY = {
  xs: ['12px', { lineHeight: '16px' }],
  sm: ['14px', { lineHeight: '20px' }],
  base: ['16px', { lineHeight: '24px' }],
  lg: ['18px', { lineHeight: '28px' }],
  xl: ['20px', { lineHeight: '28px' }],
  '2xl': ['24px', { lineHeight: '32px' }],
  '3xl': ['30px', { lineHeight: '36px' }],
} as const;

// ============================================================================
// Shadows
// ============================================================================

export const SBB_SHADOWS = {
  card: '0 2px 8px rgba(0, 0, 0, 0.08)',
  modal: '0 4px 24px rgba(0, 0, 0, 0.15)',
  button: '0 2px 4px rgba(0, 0, 0, 0.1)',
} as const;

// ============================================================================
// Timing Windows (domain-specific)
// ============================================================================

export const REPORTING_WINDOWS = {
  instantAlertMinutes: 30,   // Driver gets instant notification
  priorityHours: 2,          // Priority handling
  standardHours: 24,         // Standard queue
} as const;

// ============================================================================
// Type exports for TypeScript
// ============================================================================

export type SbbColor = keyof typeof SBB_COLORS;
export type SbbSpacing = keyof typeof SBB_SPACING;
