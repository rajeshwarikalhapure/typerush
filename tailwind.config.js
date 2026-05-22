/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        mono: ['Share Tech Mono', 'monospace'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        neon: {
          cyan: '#00ffff',
          pink: '#ff00ff',
          purple: '#8b00ff',
          green: '#00ff88',
          yellow: '#ffff00',
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'scan': 'scan 4s linear infinite',
        'flicker': 'flicker 0.15s infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px #00ffff, 0 0 20px #00ffff' },
          '50%': { boxShadow: '0 0 20px #00ffff, 0 0 60px #00ffff, 0 0 100px #00ffff' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
