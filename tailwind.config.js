/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0a0f',
          gray: '#1a1a2e',
          light: '#16213e',
          accent: '#2a2a40',
        },
        neon: {
          blue: '#00f0ff',
          purple: '#8b5cf6',
          pink: '#ff006e',
          green: '#00ff88',
        },
      },
      fontFamily: {
        cyber: ['Orbitron', 'monospace'],
        futuristic: ['Exo 2', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'neon-glow': 'neon-glow 2s ease-in-out infinite alternate',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-reverse': 'float-reverse 3s ease-in-out infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'data-stream': 'data-stream 2s ease-in-out infinite',
        'matrix-rain': 'matrix-rain 8s linear infinite',
        'holographic': 'holographic-move 3s ease infinite',
        'grid-move': 'grid-move 20s linear infinite',
        'scan-line': 'scan-line 3s ease-in-out infinite',
        'particle-float': 'particle-float 4s ease-in-out infinite',
        'loading-dots': 'loading-dots 1.5s steps(4, end) infinite',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
        'neon-lg': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
        'cyber': '0 8px 32px rgba(0, 240, 255, 0.3)',
        'cyber-lg': '0 12px 40px rgba(0, 240, 255, 0.4)',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(45deg, rgba(0, 240, 255, 0.1), rgba(139, 92, 246, 0.1))',
        'holographic': 'linear-gradient(45deg, #ff006e, #8b5cf6, #00f0ff, #00ff88)',
      },
    },
  },
  plugins: [],
};
