/**
 * Shared motion spec for every carousel / slider on the site.
 * Slower bank-grade pace: long decelerate, readable dwell.
 */
export const SITE_SLIDER = {
  /** Gap between auto-advances — slower so content can be read. */
  intervalMs: 6000,
  /** Track settle duration — smooth right→left glide. */
  durationMs: 950,
  /** Soft decelerate (smoother than snappy at longer durations). */
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  /** Soft hover / chrome transitions. */
  easeSoft: 'cubic-bezier(0.25, 1, 0.5, 1)',
  /** Entrance / reveal decelerate (matches fadeInUp). */
  easeOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
  /** Inactive neighbor treatment on product rails. */
  neighborOpacity: 0.72,
  neighborScale: 0.985,
} as const;
