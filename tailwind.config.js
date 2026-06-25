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
          orange: '#FF6B00',
          gold: '#D4A853',
          platinum: '#E8E8E8',
          dark: '#0a0a0a',
          darker: '#050505',
          surface: '#111111',
          surface2: '#1a1a1a',
          muted: '#888888',
          light: '#f0f0f0',
        }
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        accent: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        }
      },
      boxShadow: {
        'glow-orange': '0 0 40px rgba(255, 107, 0, 0.3)',
        'glow-gold': '0 0 40px rgba(212, 168, 83, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '12px',
      }
    },
  },
  plugins: [],
}