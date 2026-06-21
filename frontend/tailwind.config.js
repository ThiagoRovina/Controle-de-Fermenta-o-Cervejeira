/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#1D1D2D',
          navy: '#063852',
          slate: '#ACBBCD',
          gray: '#A4A4A4',
          light: '#EBEBEB',
          yellow: '#FFC524',
          green: '#9CD497',
          red: '#FA9897',
        },
      },
      boxShadow: {
        panel: '0 1px 2px rgba(29, 29, 45, 0.08)',
      },
    },
  },
  plugins: [],
}
