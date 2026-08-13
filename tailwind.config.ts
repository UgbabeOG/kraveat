import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#f5ebdc',
        brown: '#4b2a14',
        orange: '#f59e0b',
        gold: '#fbbf24',
        'warm-white': '#ffffff',
        'warm-gray': '#f5f0eb',
        'text-primary': '#4b2a14',
        'text-secondary': '#8b5e3c',
        accent: '#f59e0b',
        'accent-hover': '#d97706',
        success: '#16a34a',
        danger: '#dc2626',
      },
      borderRadius: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '2.5rem',
      },
      boxShadow: {
        warm: '0 4px 20px -2px rgba(75, 42, 20, 0.08)',
        'warm-lg': '0 10px 30px -4px rgba(75, 42, 20, 0.12)',
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
