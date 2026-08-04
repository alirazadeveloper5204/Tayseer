/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', './public/**/*.svg'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            DEFAULT: '#00F2FE',
            50: '#CFFBFF',
            100: '#A6F5FF',
            200: '#76EFFF',
            300: '#39E8FF',
            400: '#10DAF4',
            500: '#00F2FE',
            600: '#00D8E0',
            700: '#00B8C4',
            800: '#008C9A',
            900: '#005A65',
          },
          green: {
            DEFAULT: '#10B981',
            50: '#CBF6E5',
            100: '#A2EFD1',
            200: '#69E3B2',
            300: '#34D399',
            400: '#17C48F',
            500: '#10B981',
            600: '#0EA371',
            700: '#0A7C5A',
            800: '#075C43',
            900: '#044031',
          },
        },
        surface: {
          dark: '#030712', /* Rich Obsidian */
          'dark-elevated': '#0F172A',
          'dark-muted': '#111827',
          light: '#F7F9FC',
          'light-elevated': '#FFFFFF',
          'light-muted': '#EEF2F7',
        },
        ink: {
          DEFAULT: '#0B1220',
          soft: '#667085',
          inverse: '#E5E7EB',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        arabic: ['"IBM Plex Sans Arabic"', '"Kumbh Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      /* Fluid type scale (viewport-clamped) */
      fontSize: {
        'fluid-xs': ['clamp(0.75rem, 0.7rem + 0.2vw, 0.8125rem)', { lineHeight: '1.4' }],
        'fluid-sm': ['clamp(0.875rem, 0.82rem + 0.25vw, 0.9375rem)', { lineHeight: '1.5' }],
        'fluid-base': ['clamp(1rem, 0.95rem + 0.3vw, 1.125rem)', { lineHeight: '1.65' }],
        'fluid-lg': ['clamp(1.125rem, 1.05rem + 0.4vw, 1.25rem)', { lineHeight: '1.6' }],
        'fluid-xl': ['clamp(1.25rem, 1.1rem + 0.7vw, 1.5rem)', { lineHeight: '1.4' }],
        'fluid-2xl': ['clamp(1.5rem, 1.25rem + 1vw, 2rem)', { lineHeight: '1.25' }],
        'fluid-3xl': ['clamp(1.875rem, 1.4rem + 1.6vw, 2.5rem)', { lineHeight: '1.15' }],
        'fluid-4xl': ['clamp(2.25rem, 1.6rem + 2.4vw, 3.5rem)', { lineHeight: '1.08' }],
        'fluid-5xl': ['clamp(2.75rem, 1.8rem + 3.2vw, 4.5rem)', { lineHeight: '1.05' }],
      },
      /* Fluid spacing */
      spacing: {
        'fluid-xs': 'clamp(0.5rem, 0.4rem + 0.4vw, 0.75rem)',
        'fluid-sm': 'clamp(0.75rem, 0.6rem + 0.6vw, 1rem)',
        'fluid-md': 'clamp(1rem, 0.8rem + 0.9vw, 1.5rem)',
        'fluid-lg': 'clamp(1.5rem, 1.1rem + 1.4vw, 2.5rem)',
        'fluid-xl': 'clamp(2rem, 1.4rem + 2vw, 3.5rem)',
        'fluid-2xl': 'clamp(2.5rem, 1.6rem + 3vw, 5rem)',
        'fluid-3xl': 'clamp(3rem, 2rem + 4vw, 6.5rem)',
      },
      maxWidth: {
        content: '72rem', /* ~1152px — constrained reading/content column */
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 242, 254, 0.10)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(135deg, #00F2FE 0%, #00D8E0 55%, #10B981 100%)',
        'brand-gradient-cta':
          'linear-gradient(107deg, #00D8E0 30%, #10B981 80%)',
        'geometric-corner':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' fill='none'%3E%3Cpath d='M100 100V20H20' stroke='%23095A8D' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M88 100V32H20' stroke='%23095A8D' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' opacity='0.75'/%3E%3Cpath d='M76 100V44H20' stroke='%23095A8D' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' opacity='0.55'/%3E%3Cpath d='M64 100V56H20' stroke='%23095A8D' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' opacity='0.4'/%3E%3Cpath d='M52 100V68H20' stroke='%23095A8D' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' opacity='0.25'/%3E%3C/svg%3E\")",
      },
      animation: {
        'geometric-pulse': 'geometric-pulse 1.6s ease-in-out infinite',
      },
      keyframes: {
        'geometric-pulse': {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
