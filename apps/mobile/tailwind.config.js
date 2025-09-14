/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../packages/ui/src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [
    require("nativewind/preset"),
    require("../../packages/ui/tailwind.config.js")
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
