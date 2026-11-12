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
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#ff6701', // Robusty Orange Oficial
          600: '#e55b00',
          700: '#cc4f00',
          800: '#9a3412',
          900: '#7c2d12',
          DEFAULT: '#ff6701',
        },
        robusty: {
          orange: '#ff6701',
          dark: '#14171d',
          charcoal: '#1e232d',
          steel: '#333b47',
          gray: '#525d6d',
          light: '#f4f5f8'
        },
        slate: {
          850: '#151f30',
          950: '#0b1120',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['"Manrope"', '"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Manrope"', '"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
