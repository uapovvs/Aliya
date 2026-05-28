import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Inter + major-second scale (ratio 1.125)
      fontSize: {
        'xs':   ['0.79rem',   { lineHeight: '1.6',  letterSpacing: '0.01em'  }],
        'sm':   ['0.889rem',  { lineHeight: '1.6',  letterSpacing: '0.005em' }],
        'base': ['1rem',      { lineHeight: '1.5',  letterSpacing: '0'       }],
        'lg':   ['1.125rem',  { lineHeight: '1.4',  letterSpacing: '-0.005em'}],
        'xl':   ['1.266rem',  { lineHeight: '1.35', letterSpacing: '-0.01em' }],
        '2xl':  ['1.424rem',  { lineHeight: '1.25', letterSpacing: '-0.015em'}],
        '3xl':  ['1.602rem',  { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        '4xl':  ['1.802rem',  { lineHeight: '1.1',  letterSpacing: '-0.025em'}],
      },
      colors: {
        brand: {
          50:  '#f0f7ff',
          100: '#e0effe',
          500: '#0070cc',
          600: '#005fa8',
          700: '#004d87',
          900: '#002d52',
        },
        // KMG corporate dark blue
        kmg: {
          DEFAULT: '#003D7A',
          light:   '#0059B2',
          dark:    '#002752',
        },
        barrel: '#D4A017',
      },
    },
  },
  plugins: [],
} satisfies Config
