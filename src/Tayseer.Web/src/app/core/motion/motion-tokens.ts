/**
 * Tayseer motion tokens — single source for CSS vars + GSAP easings.
 * Keep in sync with styles.css `:root` --motion-* variables.
 */
export const MOTION = {
  duration: {
    instant: 0.12,
    fast: 0.2,
    base: 0.45,
    slider: 0.65,
    scroll: 0.7,
  },
  /** GSAP ease names mapped to design tokens. */
  ease: {
    out: 'power3.out',
    soft: 'power2.out',
    snappy: 'expo.out',
    inout: 'power2.inOut',
    exit: 'power2.in',
  },
  /** CSS cubic-bezier strings (for Angular animate / inline styles). */
  css: {
    out: 'cubic-bezier(0.22, 1, 0.36, 1)',
    soft: 'cubic-bezier(0.25, 1, 0.5, 1)',
    snappy: 'cubic-bezier(0.19, 1, 0.22, 1)',
    inout: 'cubic-bezier(0.65, 0, 0.35, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
  },
} as const;
