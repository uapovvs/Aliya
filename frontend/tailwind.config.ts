import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SF Mono', 'monospace'],
      },
      colors: {
        // Linear-style canvas + surface ladder
        canvas:  '#010102',
        's1':    '#0f1011',
        's2':    '#141516',
        's3':    '#18191a',
        hl:      '#23252a',
        'hl-strong': '#34343a',

        // Text
        ink:        '#f7f8f8',
        'ink-muted':   '#d0d6e0',
        'ink-subtle':  '#8a8f98',
        'ink-tertiary':'#62666d',

        // Accents
        accent:      '#5e6ad2',
        'accent-hover': '#828fff',
        'accent-focus': '#5e69d1',

        // Barrel gold (gamification)
        barrel:      '#D4A017',
        'barrel-dim':   '#a07a0f',

        // Semantic
        success: '#27a644',
        danger:  '#e54d2e',
      },
      fontSize: {
        'display': ['2.5rem', { lineHeight: '1.10', letterSpacing: '-0.04em', fontWeight: '600' }],
        'headline': ['1.75rem', { lineHeight: '1.20', letterSpacing: '-0.03em', fontWeight: '600' }],
        'card-title': ['1.25rem', { lineHeight: '1.25', letterSpacing: '-0.02em', fontWeight: '500' }],
        'body-lg': ['1rem', { lineHeight: '1.50', letterSpacing: '-0.005em' }],
        'body': ['0.875rem', { lineHeight: '1.50', letterSpacing: '0' }],
        'caption': ['0.75rem', { lineHeight: '1.40', letterSpacing: '0' }],
        'eyebrow': ['0.6875rem', { lineHeight: '1.30', letterSpacing: '0.05em', fontWeight: '500' }],
      },
      borderRadius: {
        sm:   '6px',
        md:   '8px',
        lg:   '12px',
        xl:   '16px',
        pill: '9999px',
        full: '9999px',
      },
      borderColor: {
        DEFAULT: '#23252a',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'barrel-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'barrel-pulse': 'barrel-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
