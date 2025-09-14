/** @type {import('tailwindcss').Config} */
const palmeraPreset = require('@palmera/ui/tailwind.preset.cjs');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [palmeraPreset],
  theme: {
    extend: {},
  },
  plugins: [],
}