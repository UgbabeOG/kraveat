import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: '#f5ebdc',
        brown: '#4b2a14',
        orange: '#f59e0b',
        gold: '#fbbf24'
      }
    }
  },
  plugins: []
} satisfies Config;
