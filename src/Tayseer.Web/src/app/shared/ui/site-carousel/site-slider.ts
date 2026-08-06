/**
 * Shared motion spec for every carousel / slider on the site.
 * Aligned with Tayseer design direction: Adyen settle + Stripe polish.
 */
export const SITE_SLIDER = {
  /** Gap between auto-advances — banking pace, not consumer-app rush. */
  intervalMs: 4500,
  /** Track settle duration. */
  durationMs: 650,
  /** Adyen-style out_snappy decelerate. */
  easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
  /** Soft hover / chrome transitions. */
  easeSoft: 'cubic-bezier(0.25, 1, 0.5, 1)',
  /** Entrance / reveal decelerate (matches fadeInUp). */
  easeOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
  /** Inactive neighbor treatment on product rails. */
  neighborOpacity: 0.72,
  neighborScale: 0.985,
} as const;
