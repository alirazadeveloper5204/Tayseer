/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', './public/**/*.svg'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            DEFAULT: '#095A8D',
            50: '#E8F3F9',
            100: '#C5E0F0',
            200: '#8FC2E0',
            300: '#59A3CF',
            400: '#2E84B5',
            500: '#095A8D',
            600: '#0D5A8E',
            700: '#084A73',
            800: '#063A5A',
            900: '#042941',
          },
          green: {
            DEFAULT: '#62A845',
            50: '#F0F8EB',
            100: '#D7EDC9',
            200: '#B5DD9A',
            300: '#8FCC6B',
            400: '#70AD47',
            500: '#62A845',
            600: '#4F8A37',
            700: '#3D6B2A',
            800: '#2B4D1E',
            900: '#1A2F12',
          },
        },
        surface: {
          dark: '#0A0A0A',
          'dark-elevated': '#12161C',
          'dark-muted': '#1A2030',
          light: '#F7F9FC',
          'light-elevated': '#FFFFFF',
          'light-muted': '#EEF2F7',
        },
        ink: {
          DEFAULT: '#1A2332',
          soft: '#5B6478',
          inverse: '#E8EEF5',
        },
      },
      /* Professional sans — brand stack (not Inter/Roboto generics) */
      fontFamily: {
        display: ['"Space Grotesk"', '"Kumbh Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Kumbh Sans"', 'system-ui', 'sans-serif'],
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
        glass: '0 8px 32px rgba(9, 90, 141, 0.12)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(135deg, #0D5A8E 0%, #095A8D 69%, #62A845 100%)',
        'brand-gradient-cta':
          'linear-gradient(107deg, #0D5A8E 51%, #62A845 81%)',
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
