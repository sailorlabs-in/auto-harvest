/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary earthy farming palette
        harvest: {
          50: '#faf8f2',
          100: '#f3efe3',
          200: '#e5ddc6',
          300: '#d4c7a1',
          400: '#c0ab79',
          500: '#b09558',
          600: '#a3834a',
          700: '#886a3e',
          800: '#6f5637',
          900: '#5b4730',
          950: '#312418',
        },
        // Olive green accent
        olive: {
          50: '#f6f7f0',
          100: '#eaeddc',
          200: '#d6dcbc',
          300: '#bbc493',
          400: '#a1ac6e',
          500: '#849151',
          600: '#67733e',
          700: '#505933',
          800: '#41482c',
          900: '#383e28',
          950: '#1c2112',
        },
        // Dark backgrounds
        farm: {
          50: '#f4f4f2',
          100: '#e3e2df',
          200: '#c9c7c1',
          300: '#a9a69e',
          400: '#8f8b81',
          500: '#7a756b',
          600: '#68635a',
          700: '#56524b',
          800: '#494642',
          900: '#403d3a',
          925: '#2a2825',
          950: '#1a1918',
          975: '#121110',
        },
        // Accent colors for UI
        growth: '#90BE6D',
        water: '#4A90D9',
        energy: '#FFD700',
        danger: '#E74C3C',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glow-olive': 'radial-gradient(ellipse at center, rgba(132, 145, 81, 0.15) 0%, transparent 70%)',
        'glow-harvest': 'radial-gradient(ellipse at center, rgba(176, 149, 88, 0.15) 0%, transparent 70%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          from: { boxShadow: '0 0 10px rgba(132, 145, 81, 0.3)' },
          to: { boxShadow: '0 0 25px rgba(132, 145, 81, 0.6)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
