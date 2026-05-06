/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf2f5',
          100: '#fce4ea',
          200: '#f9c8d3',
          300: '#f5a8b5',
          400: '#ef8499',
          500: '#ea899a',
          600: '#d37989',
          700: '#c4606f',
          800: '#9a4d5b',
          900: '#7a3c47',
        },
      },
    },
  },
  plugins: [],
}
