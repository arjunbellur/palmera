/** Shared Tailwind tokens for Palmera (web + mobile) */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#f97316', dark: '#ea580c' },
        success: '#16a34a',
        warning: '#f59e0b',
        danger:  '#dc2626',
      },
      borderRadius: { xl: '1rem', '2xl': '1.25rem' },
    },
    fontSize: {
      xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 28
    },
    spacing: {
      1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64
    }
  }
};
