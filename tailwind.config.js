/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        voltnex: {
          blue: '#2563EB',
          'blue-dark': '#1D4ED8',
          'blue-light': '#3B82F6',
          cyan: '#06B6D4',
          'cyan-dark': '#0891B2',
          'cyan-light': '#22D3EE',
          violet: '#7C3AED',
          'violet-dark': '#6D28D9',
          'violet-light': '#8B5CF6',
          bg: '#F5F9FF',
          text: '#172033',
          muted: '#64748B',
          surface: '#FFFFFF',
          border: '#E2E8F0',
        },
        volt: {
          50: '#F5F9FF',
          100: '#E0EFFE',
          200: '#BAE0FD',
          300: '#7CC7FB',
          400: '#38AAF7',
          500: '#06B6D4',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#172033',
          950: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'circuit-grid': "radial-gradient(circle, rgba(37, 99, 235, 0.08) 1.5px, transparent 1.5px)",
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'elevated': '0 10px 25px -3px rgba(37, 99, 235, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px -2px rgba(23, 32, 51, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'glow': '0 0 25px -5px rgba(37, 99, 235, 0.25)',
      }
    },
  },
  plugins: [],
}
