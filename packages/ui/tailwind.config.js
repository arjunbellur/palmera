const { tokens } = require('../../packages/tokens/dist/index.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        // Brand colors
        midnight: tokens.colors.midnight,
        palm: tokens.colors.palm,
        ivory: tokens.colors.ivory,
        sandstone: tokens.colors.sandstone,
        gold: tokens.colors.gold,
        // Semantic colors
        primary: tokens.colors.primary,
        secondary: tokens.colors.secondary,
        accent: tokens.colors.accent,
        background: tokens.colors.background,
        surface: tokens.colors.surface,
        text: tokens.colors.text,
        textSecondary: tokens.colors.textSecondary,
        textMuted: tokens.colors.textMuted,
        border: tokens.colors.border,
        error: tokens.colors.error,
        warning: tokens.colors.warning,
        success: tokens.colors.success,
        info: tokens.colors.info,
      },
      spacing: tokens.spacing,
      borderRadius: tokens.borderRadius,
      fontSize: tokens.fontSize,
      boxShadow: tokens.shadows,
      zIndex: tokens.zIndex,
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
