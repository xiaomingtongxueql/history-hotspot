/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#1a1410',
          secondary: '#2d2318',
        },
        gold: {
          DEFAULT: '#c9a84c',
          light: '#e8c96a',
          dark: '#a07830',
        },
        cream: '#f0e6d3',
      },
      fontFamily: {
        serif: ['Source Han Serif CN', 'Noto Serif SC', 'serif'],
        sans: ['Source Han Sans CN', 'Noto Sans SC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
