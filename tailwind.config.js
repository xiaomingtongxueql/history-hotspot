/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#FDFCF8',
          warm: '#FAF8F3',
          deep: '#F5F3ED',
          subtle: '#F0EDE5',
        },
        gold: {
          DEFAULT: '#98690E',
          light: '#C4A35A',
          bright: '#D4AF37',
          subtle: 'rgba(152, 105, 14, 0.06)',
          glow: 'rgba(212, 175, 55, 0.12)',
        },
        ink: {
          DEFAULT: '#1A1814',
          soft: '#3D3830',
          muted: '#7A756A',
          faint: '#B5B0A5',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#FEFDFB',
          overlay: 'rgba(253, 252, 248, 0.95)',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Noto Serif SC', 'Georgia', 'serif'],
        heading: ['Noto Serif SC', 'Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(26, 24, 20, 0.04)',
        'card': '0 4px 20px rgba(26, 24, 20, 0.05)',
        'card-hover': '0 12px 40px rgba(26, 24, 20, 0.1)',
        'elevated': '0 16px 48px rgba(26, 24, 20, 0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}