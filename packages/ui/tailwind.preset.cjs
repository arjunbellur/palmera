/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        // Palmera Brand Colors
        midnight: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          950: '#0B1D39', // Primary midnight blue
        },
        palm: {
          50: '#f0f9f4',
          100: '#dcf2e4',
          200: '#bce5cd',
          300: '#8dd1a8',
          400: '#56b57c',
          500: '#339a5a',
          600: '#257d47',
          700: '#1f633a',
          800: '#1c4f30',
          900: '#1C5E3C', // Primary palm green
          950: '#0f2a1c',
        },
        ivory: {
          50: '#F8F6F2', // Primary ivory white
          100: '#f5f2ed',
          200: '#eae4d8',
          300: '#ddd2c0',
          400: '#d0bda3',
          500: '#c4a886',
          600: '#b8956a',
          700: '#a67f52',
          800: '#8a6a45',
          900: '#6f5538',
          950: '#3d2f1f',
        },
        sandstone: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#E0C9A6', // Primary sandstone beige
          300: '#d4b88a',
          400: '#c8a66e',
          500: '#bc9452',
          600: '#a67f3e',
          700: '#8a6a33',
          800: '#6e5529',
          900: '#52401f',
          950: '#362b15',
        },
        gold: {
          50: '#fefcf5',
          100: '#fdf7e6',
          200: '#fbecc7',
          300: '#f8dca0',
          400: '#f5c778',
          500: '#CFA348', // Primary gold accent
          600: '#b88a2a',
          700: '#9a6f1f',
          800: '#7c5719',
          900: '#5e3f13',
          950: '#40280d',
        },
      },
      fontFamily: {
        'display': ['Playfair Display', 'Cormorant', 'serif'],
        'body': ['Lato', 'Open Sans', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'palmera': '0 4px 6px -1px rgba(11, 29, 57, 0.1), 0 2px 4px -1px rgba(11, 29, 57, 0.06)',
        'palmera-lg': '0 10px 15px -3px rgba(11, 29, 57, 0.1), 0 4px 6px -2px rgba(11, 29, 57, 0.05)',
      },
    },
  },
  plugins: [],
}
