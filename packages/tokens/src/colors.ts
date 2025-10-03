/**
 * Palmera Brand Colors
 * Brand Identity: Premium luxury travel
 * Tagline: "Escape. Indulge. Experience."
 */

export const colors = {
  // Core Brand Palette
  brand: {
    forestGreen: '#2E5339',
    gold: '#D4AF37',
    midnightBlue: '#191970',
  },

  // Supporting Neutrals
  neutral: {
    sandBeige: '#E6D5B8',
    offWhite: '#F9F7F4',
    charcoalGray: '#2C2C2C',
  },

  // Semantic Colors - Light Mode
  light: {
    background: '#F9F7F4', // Off-White
    surface: '#FFFFFF',
    surfaceSecondary: '#E6D5B8', // Sand Beige
    primary: '#2E5339', // Forest Green
    secondary: '#D4AF37', // Gold
    accent: '#191970', // Midnight Blue
    text: '#2C2C2C', // Charcoal Gray
    textSecondary: '#666666',
    textMuted: '#999999',
    border: '#E6D5B8',
    borderHover: '#D4AF37',
    success: '#2E5339',
    warning: '#D4AF37',
    error: '#DC2626',
    info: '#191970',
  },

  // Semantic Colors - Dark Mode
  dark: {
    background: '#191970', // Midnight Blue
    surface: '#2C2C2C', // Charcoal Gray
    surfaceSecondary: '#2E5339', // Forest Green
    primary: '#D4AF37', // Gold
    secondary: '#2E5339', // Forest Green
    accent: '#D4AF37', // Gold
    text: '#F9F7F4', // Off-White
    textSecondary: '#E6D5B8',
    textMuted: '#999999',
    border: '#2E5339',
    borderHover: '#D4AF37',
    success: '#2E5339',
    warning: '#D4AF37',
    error: '#FF6B6B',
    info: '#D4AF37',
  },

  // Usage Ratios (60-25-10-5 rule)
  ratios: {
    dominant: '#191970', // 60% - Midnight Blue (backgrounds)
    major: '#2E5339', // 25% - Forest Green (accents)
    minor: '#D4AF37', // 10% - Gold (CTAs, highlights)
    accent: '#E6D5B8', // 5% - Beige (contrast)
  },

  // Component-Specific Colors
  button: {
    primary: {
      bg: '#D4AF37',
      bgHover: '#2E5339',
      text: '#2C2C2C',
      textHover: '#F9F7F4',
    },
    secondary: {
      bg: 'transparent',
      bgHover: '#D4AF37',
      text: '#2E5339',
      textHover: '#2C2C2C',
      border: '#2E5339',
      borderHover: '#D4AF37',
    },
  },

  // Card/Container Colors
  card: {
    light: {
      bg: '#FFFFFF',
      bgHover: '#F9F7F4',
      border: '#E6D5B8',
      borderHover: '#D4AF37',
      shadow: 'rgba(212, 175, 55, 0.1)',
    },
    dark: {
      bg: '#2C2C2C',
      bgHover: '#2E5339',
      border: '#2E5339',
      borderHover: '#D4AF37',
      shadow: 'rgba(212, 175, 55, 0.2)',
    },
  },

  // Navigation Colors
  navigation: {
    light: {
      bg: '#FFFFFF',
      active: '#2E5339',
      hover: '#D4AF37',
      text: '#2C2C2C',
      textActive: '#2E5339',
    },
    dark: {
      bg: '#2C2C2C',
      active: '#D4AF37',
      hover: '#2E5339',
      text: '#F9F7F4',
      textActive: '#D4AF37',
    },
  },
} as const;

export type ColorScheme = 'light' | 'dark';

