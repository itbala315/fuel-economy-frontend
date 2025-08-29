/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50, #f9fafb)',
          100: 'var(--color-primary-100, #f3f4f6)',
          200: 'var(--color-primary-200, #e5e7eb)',
          300: 'var(--color-primary-300, #d1d5db)',
          400: 'var(--color-primary-400, #9ca3af)',
          500: 'var(--color-primary-500, #6b7280)',
          600: 'var(--color-primary-600, #374151)',
          700: 'var(--color-primary-700, #1f2937)',
          800: 'var(--color-primary-800, #111827)',
          900: 'var(--color-primary-900, #000000)',
        },
        accent: {
          50: 'var(--color-accent-50, #ffffff)',
          100: 'var(--color-accent-100, #f9fafb)',
          200: 'var(--color-accent-200, #f3f4f6)',
          300: 'var(--color-accent-300, #e5e7eb)',
          400: 'var(--color-accent-400, #d1d5db)',
          500: 'var(--color-accent-500, #9ca3af)',
          600: 'var(--color-accent-600, #6b7280)',
          700: 'var(--color-accent-700, #374151)',
          800: 'var(--color-accent-800, #1f2937)',
          900: 'var(--color-accent-900, #000000)',
        },
        background: 'var(--color-background, #ffffff)',
        surface: 'var(--color-surface, #000000)',
        'text-primary': 'var(--color-text-primary, #000000)',
        'text-secondary': 'var(--color-text-secondary, #6b7280)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
