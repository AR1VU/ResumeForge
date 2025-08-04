/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#333333',
        'off-white': '#FAFAFA',
        'pastel-blue': '#A3D5FF',
        'pastel-mint': '#B2F2BB',
        // Web3 theme colors
        'web3-dark': '#1a1b23',
        'web3-darker': '#0f1015',
        'web3-gray': '#2a2d3a',
        'web3-light-gray': '#3a3d4a',
        'web3-accent': '#6366f1', // Indigo
        'web3-secondary': '#8b5cf6', // Purple
        'web3-success': '#10b981', // Emerald
        'web3-warning': '#f59e0b', // Amber
        'web3-text': '#e2e8f0',
        'web3-text-muted': '#94a3b8',
        'web3-border': '#374151',
        primary: '#A3D5FF',
        secondary: '#B2F2BB',
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
      },
      animation: {
        'slide-in': 'slideIn 300ms ease-out',
        'fade-in': 'fadeIn 200ms ease-out',
        'scale-up': 'scaleUp 150ms ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};