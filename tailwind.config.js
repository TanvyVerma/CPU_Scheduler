/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        bg: {
          1: '#07080d',
          2: '#0e1018',
          3: '#151720',
          4: '#1d2030',
          5: '#252840',
        },
        accent: {
          DEFAULT: '#7c6fff',
          2: '#b39dff',
          3: 'rgba(124,111,255,0.15)',
        },
      },
      animation: {
        'pulse-green': 'pulseGreen 1.2s ease-in-out infinite',
        'slide-in': 'slideIn 0.2s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        pulseGreen: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(14,207,142,0.3)' },
          '50%': { boxShadow: '0 0 0 6px rgba(14,207,142,0)' },
        },
        slideIn: {
          from: { transform: 'translateX(-8px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
