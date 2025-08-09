/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Gold Theme
        gold: {
          50: '#fffdf2',
          100: '#fffbeb',
          200: '#fef3c7',
          300: '#fde68a',
          400: '#fcd34d',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Rich Dark variations (avoiding pure black)
        obsidian: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#0f0f12', // Rich dark instead of pure black
        },
        // Updated role colors to fit gold/black/white theme
        tank: {
          500: '#fbbf24', // Golden yellow for tanks
          600: '#f59e0b',
          700: '#d97706',
        },
        healer: {
          500: '#f8fafc', // Soft white for healers
          600: '#f1f5f9',
          700: '#e2e8f0',
        },
        dps: {
          500: '#dc2626', // Vibrant red for DPS
          600: '#b91c1c',
          700: '#991b1b',
        },
        // Faction colors updated for theme
        alliance: {
          500: '#3b82f6',
          600: '#2563eb',
        },
        horde: {
          500: '#dc2626',
          600: '#b91c1c',
        },
      },
      fontFamily: {
        'wow': ['Cinzel', 'serif'],
        'elegant': ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0f0f12 0%, #18181b 50%, #27272a 100%)',
        'premium-gradient': 'linear-gradient(135deg, #0f0f12 0%, #18181b 30%, #fbbf24 100%)',
        'reverse-gradient': 'linear-gradient(135deg, #fbbf24 0%, #18181b 70%, #0f0f12 100%)',
        'subtle-gradient': 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)',
        'gold-shine': 'linear-gradient(45deg, transparent 30%, rgba(251, 191, 36, 0.3) 50%, transparent 70%)',
      },
      animation: {
        'gold-shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(251, 191, 36, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(251, 191, 36, 0.6)' },
        },
      },
      boxShadow: {
        'gold': '0 4px 14px 0 rgba(251, 191, 36, 0.39)',
        'gold-lg': '0 10px 25px -3px rgba(251, 191, 36, 0.4), 0 4px 6px -2px rgba(251, 191, 36, 0.05)',
        'obsidian': '0 4px 14px 0 rgba(15, 15, 18, 0.8)',
        'obsidian-lg': '0 25px 50px -12px rgba(15, 15, 18, 0.9)',
        'premium': '0 20px 25px -5px rgba(15, 15, 18, 0.8), 0 10px 10px -5px rgba(251, 191, 36, 0.2)',
      }
    },
  },
  plugins: [],
} 