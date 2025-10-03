/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core Brand Palette
        'forest-green': '#2E5339',
        'gold': '#D4AF37',
        'midnight-blue': '#191970',
        'sand-beige': '#E6D5B8',
        'off-white': '#F9F7F4',
        'charcoal': '#2C2C2C',

        // Semantic Colors
        primary: {
          DEFAULT: '#2E5339',
          hover: '#1F3926',
          light: '#3D6B4A',
        },
        secondary: {
          DEFAULT: '#D4AF37',
          hover: '#B8962F',
          light: '#E5C957',
        },
        accent: {
          DEFAULT: '#191970',
          hover: '#0F0F4A',
          light: '#2929A3',
        },

        // Light Mode
        background: '#F9F7F4',
        surface: '#FFFFFF',
        'surface-secondary': '#E6D5B8',

        // Dark Mode
        'dark-background': '#191970',
        'dark-surface': '#2C2C2C',
        'dark-surface-secondary': '#2E5339',
      },
      fontFamily: {
        heading: ['"Playfair Display"', '"Garamond"', 'Georgia', 'serif'],
        body: ['"Inter"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h2': ['2.25rem', { lineHeight: '1.25' }],
        'h3': ['1.875rem', { lineHeight: '1.3' }],
        'h4': ['1.5rem', { lineHeight: '1.4' }],
      },
      boxShadow: {
        'gold-sm': '0 1px 2px 0 rgba(212, 175, 55, 0.05)',
        'gold': '0 4px 6px -1px rgba(212, 175, 55, 0.1), 0 2px 4px -1px rgba(212, 175, 55, 0.06)',
        'gold-md': '0 6px 12px -2px rgba(212, 175, 55, 0.15)',
        'gold-lg': '0 10px 20px -3px rgba(212, 175, 55, 0.2)',
        'gold-xl': '0 20px 30px -5px rgba(212, 175, 55, 0.25)',
      },
      borderRadius: {
        'card': '1rem',
        'button': '0.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'gold-shimmer': 'goldShimmer 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        goldShimmer: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
