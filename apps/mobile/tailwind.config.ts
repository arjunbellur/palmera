import type { Config } from 'tailwindcss';
const shared = require('../../packages/tokens/tailwind.config.shared');

export default {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: shared.theme,
  plugins: [],
} satisfies Config;