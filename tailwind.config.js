/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fbf8ef',
          100: '#f5ecd3',
          200: '#ebd9a6',
          300: '#e0c47c',
          400: '#d5ae58',
          500: '#c99a3d',
          600: '#b07f2e',
          700: '#8a6225',
          800: '#5c431d',
          900: '#3a2b15',
          950: '#1d160c',
        },
        gold: {
          50: '#fbf8ef',
          100: '#f5ecd3',
          200: '#ebd9a6',
          300: '#e0c47c',
          400: '#d5ae58',
          500: '#c99a3d',
          600: '#b07f2e',
          700: '#8a6225',
          800: '#5c431d',
          900: '#3a2b15',
          950: '#1d160c',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        black: {
          light: '#1a1a1a',
          DEFAULT: '#000000',
          dark: '#000000',
        }
      },
      fontFamily: {
        display: ['Outfit', 'Inter', 'ui-sans-serif', 'system-ui'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}