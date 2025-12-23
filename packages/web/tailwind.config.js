/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dp-primary': '#6366f1',
        'dp-secondary': '#8b5cf6',
        'dp-accent': '#f59e0b',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
