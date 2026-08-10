/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', './public/**/*.svg'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          /* Logo navy — values mirror CSS tokens in styles.css :root */
          blue: {
            DEFAULT: '#0D5A8C',
            50: '#E8F3F9',
            100: '#C5E1F0',
            200: '#9BCAE3',
            300: '#6BAFD2',
            400: '#3D91BB',
            500: '#0D5A8C',
            600: '#0B4F7A',
            700: '#094266',
            800: '#06324D',
            900: '#042233',
          },
          /* Logo green — accent / EE letters */
          green: {
            DEFAULT: '#62A945',
            50: '#EFF8EA',
            100: '#D6EDC9',
            200: '#B5DEA0',
            300: '#8FCB72',
            400: '#74B855',
            500: '#62A945',
            600: '#4F8A37',
            700: '#3D6C2B',
            800: '#2C4E1F',
            900: '#1C3314',
          },
          /* Electric cyan — dark-theme highlight only */
          cyan: {
            DEFAULT: '#00F2FE',
            400: '#39E8FF',
            500: '#00F2FE',
            600: '#00D8E0',
          },
        },
        surface: {
          dark: '#030712' /* Rich Obsidian — CSS: --surface-dark */,
          'dark-elevated': '#0F172A',
          'dark-muted': '#111827',
          light: '#F7F9FC',
          'light-elevated': '#FFFFFF',
          'light-muted': '#EEF2F7',
        },
        ink: {
          DEFAULT: '#0B1220',
          soft: '#475569',
          inverse: '#E5E7EB',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        arabic: ['"IBM Plex Sans Arabic"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
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
      boxShadow: {
        glass:
          '0 2px 4px rgba(13, 90, 140, 0.05), 0 10px 28px rgba(13, 90, 140, 0.1), 0 24px 48px -22px rgba(13, 90, 140, 0.16)',
        'glass-dark':
          '0 8px 32px rgba(0, 0, 0, 0.42), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      },
      maxWidth: {
        content: '90rem',
      },
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(135deg, #0D5A8C 0%, #1A7BB0 55%, #62A945 100%)',
        'brand-gradient-cta':
          'linear-gradient(107deg, #0D5A8C 25%, #1A7BB0 55%, #62A945 100%)',
        'geometric-corner':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' fill='none'%3E%3Cpath d='M100 100V20H20' stroke='%230D5A8C' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M88 100V32H20' stroke='%230D5A8C' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' opacity='0.75'/%3E%3Cpath d='M76 100V44H20' stroke='%230D5A8C' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' opacity='0.55'/%3E%3Cpath d='M64 100V56H20' stroke='%230D5A8C' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' opacity='0.4'/%3E%3Cpath d='M52 100V68H20' stroke='%2362A945' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' opacity='0.55'/%3E%3C/svg%3E\")",
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
