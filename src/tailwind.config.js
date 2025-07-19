// tailwind.config.js
import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enables dark mode with a `.dark` class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        display: ["Poppins", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: '#2563eb', // Tailwind blue-600
          light: '#3b82f6',   // Tailwind blue-500
          dark: '#1d4ed8',    // Tailwind blue-700
        },
        slate: {
          950: '#0f172a',
        },
      },
      borderRadius: {
        xl: '1rem',
        "2xl": '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-animate')
  ],
};
