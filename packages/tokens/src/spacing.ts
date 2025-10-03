/**
 * Palmera Spacing System
 * 8px base unit for consistency
 */

export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
  32: '8rem',    // 128px
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  base: '0.5rem',  // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',   // 32px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(212, 175, 55, 0.05)',
  base: '0 4px 6px -1px rgba(212, 175, 55, 0.1), 0 2px 4px -1px rgba(212, 175, 55, 0.06)',
  md: '0 6px 12px -2px rgba(212, 175, 55, 0.15), 0 3px 6px -2px rgba(212, 175, 55, 0.1)',
  lg: '0 10px 20px -3px rgba(212, 175, 55, 0.2), 0 4px 8px -3px rgba(212, 175, 55, 0.15)',
  xl: '0 20px 30px -5px rgba(212, 175, 55, 0.25), 0 10px 15px -5px rgba(212, 175, 55, 0.2)',
  '2xl': '0 25px 50px -12px rgba(212, 175, 55, 0.3)',
  inner: 'inset 0 2px 4px 0 rgba(212, 175, 55, 0.06)',
  none: 'none',
} as const;

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

