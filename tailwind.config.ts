import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#f2f7f4',
          100: '#e0ede6',
          200: '#c2dbcc',
          300: '#96c0a8',
          400: '#65a07e',
          500: '#44845f',
          600: '#32694a',
          700: '#28543c',
          800: '#214430',
          900: '#1b3827',
          DEFAULT: '#44845f',
        },
        cream: {
          50:  '#fdfcf8',
          100: '#faf7f0',
          200: '#f4ede0',
          300: '#ecdfcc',
          400: '#e0ccb0',
          500: '#d4b896',
        },
        warm: {
          50:  '#fdf5f0',
          100: '#fae8dc',
          200: '#f5cebc',
          300: '#ecac90',
          400: '#e08264',
          500: '#d4614e',
        },
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '18px',
        xl: '24px',
      },
      boxShadow: {
        soft:     '0 2px 16px 0 rgba(68,132,95,0.06)',
        card:     '0 4px 24px 0 rgba(44,61,45,0.08)',
        elevated: '0 8px 48px 0 rgba(44,61,45,0.12)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both',
        'fade-in':    'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both',
        shimmer:      'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
}

export default config
