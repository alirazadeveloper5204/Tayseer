import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MOTION } from './motion-tokens';

/**
 * Shared Angular animation triggers for the Tayseer portal.
 *
 * Usage:
 *   @Component({ animations: [fadeInUp, routeFadeSlide] })
 *   // template: [@fadeInUp]
 *
 * Note: Angular 21+ also supports CSS `animate.enter` / `animate.leave`.
 * Keep using these triggers where TypeScript-driven control is clearer.
 */

const enterMs = Math.round(MOTION.duration.slider * 1000);
const leaveMs = 280;
const routeEnterMs = 420;
const routeLeaveMs = 220;

/** Simple fade + rise (cards, panels, quote body). */
export const fadeInUp = trigger('fadeInUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(1rem)' }),
    animate(
      `${enterMs}ms ${MOTION.css.out}`,
      style({ opacity: 1, transform: 'translateY(0)' }),
    ),
  ]),
  transition(':leave', [
    animate(
      `${leaveMs}ms ${MOTION.css.exit}`,
      style({ opacity: 0, transform: 'translateY(-0.5rem)' }),
    ),
  ]),
]);

/** Soft fade only. */
export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate(`${Math.round(MOTION.duration.base * 1000)}ms ${MOTION.css.soft}`, style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate(`${leaveMs}ms ${MOTION.css.exit}`, style({ opacity: 0 })),
  ]),
]);

/** Horizontal slide keyed by direction data: next | prev */
export const slideFade = trigger('slideFade', [
  transition('* => next', [
    style({ opacity: 0, transform: 'translateX(1.25rem)' }),
    animate(
      `${enterMs}ms ${MOTION.css.out}`,
      style({ opacity: 1, transform: 'translateX(0)' }),
    ),
  ]),
  transition('* => prev', [
    style({ opacity: 0, transform: 'translateX(-1.25rem)' }),
    animate(
      `${enterMs}ms ${MOTION.css.out}`,
      style({ opacity: 1, transform: 'translateX(0)' }),
    ),
  ]),
]);

/**
 * Optional router outlet animation.
 * Bind on a host wrapping `<router-outlet />`:
 *   [@routeFadeSlide]="prepareRoute(outlet)"
 */
export const routeFadeSlide = trigger('routeFadeSlide', [
  transition('* <=> *', [
    query(
      ':enter, :leave',
      style({ position: 'absolute', width: '100%', left: 0, top: 0 }),
      { optional: true },
    ),
    group([
      query(
        ':leave',
        [
          animate(
            `${routeLeaveMs}ms ${MOTION.css.exit}`,
            style({ opacity: 0, transform: 'translateY(0.5rem)' }),
          ),
        ],
        { optional: true },
      ),
      query(
        ':enter',
        [
          style({ opacity: 0, transform: 'translateY(0.75rem)' }),
          animate(
            `${routeEnterMs}ms 40ms ${MOTION.css.out}`,
            style({ opacity: 1, transform: 'translateY(0)' }),
          ),
        ],
        { optional: true },
      ),
    ]),
  ]),
]);
