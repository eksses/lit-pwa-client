/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        bnUI: ['Hind Siliguri', 'sans-serif'],
        bnSerif: ['Noto Serif Bengali', 'serif'],
        enUI: ['Inter', 'sans-serif'],
        enSerif: ['Merriweather', 'serif'],
      },
      colors: {
        sepia: {
          50: '#fffdfa',
          100: '#fbf0d9',
          200: '#f7e3b8',
          300: '#f0d292',
          400: '#e5bb68',
          500: '#d4a142',
          800: '#5c4314',
          900: '#3e2b0b',
          bg: '#fbf0d9',
          text: '#2d2318',
          card: '#f4e7ca',
          border: '#e4d3ab',
        },
        dark: {
          bg: '#121212',
          card: '#1e1e1e',
          border: '#2a2a2a',
          text: '#e5e7eb',
        },
        light: {
          bg: '#ffffff',
          card: '#f9fafb',
          border: '#e5e7eb',
          text: '#111827',
        },
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        }
      },
    },
  },
  plugins: [],
}
