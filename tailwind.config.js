/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        space: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        brand: {
          purple: '#9333ea',
          'purple-light': '#a855f7',
          'purple-dim': '#7e22ce',
        },
      },
      animation: {
        ticker: 'ticker 30s linear infinite',
        'float-up': 'floatUp 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'scroll-reviews': 'scrollReviews 40s linear infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        floatUp: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(147,51,234,0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(147,51,234,0.9), 0 0 80px rgba(147,51,234,0.4)' },
        },
        scrollReviews: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
