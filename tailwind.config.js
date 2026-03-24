/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#FAFAF8',
          secondary: '#FFFFFF',
          hover: '#F5F1E8',
        },
        gold: {
          DEFAULT: '#B8860B',
          light: '#FEF9EC',
          muted: '#D4A017',
          dark: '#8B6508',
        },
        ink: {
          DEFAULT: '#1C1917',
          secondary: '#78716C',
          muted: '#A8A29E',
          faint: '#D6D3D1',
        },
        border: '#EEEBE4',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
        modal: '0 24px 64px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        card: '12px',
        modal: '20px',
      },
    },
  },
  plugins: [],
}
