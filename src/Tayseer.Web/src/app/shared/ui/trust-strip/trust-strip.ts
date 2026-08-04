import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { LocaleService } from '../../../core/i18n/locale.service';
import { HOME_KPI_STATS } from '../../../core/i18n/ui-copy';
import { GsapService } from '../../../core/motion/gsap.service';

function formatKpi(
  value: number,
  decimals: number,
  prefix: string,
  suffix: string,
): string {
  const body = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
  return `${prefix}${body}${suffix}`;
}

@Component({
  selector: 'app-trust-strip',
  templateUrl: './trust-strip.html',
  styleUrl: './trust-strip.css',
})
export class TrustStrip {
  private readonly locale = inject(LocaleService);
  private readonly motion = inject(GsapService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject(ElementRef<HTMLElement>);

  /** Animated values — start at 0, count up on scroll enter. */
  readonly displays = signal(
    HOME_KPI_STATS.map((s) => formatKpi(0, s.decimals, s.prefix, s.suffix)),
  );

  readonly items = computed(() => {
    const isAr = this.locale.lang() === 'ar';
    const displays = this.displays();
    return HOME_KPI_STATS.map((s, i) => ({
      id: i,
      label: isAr ? s.labelAr : s.labelEn,
      display: displays[i] ?? formatKpi(0, s.decimals, s.prefix, s.suffix),
      final: formatKpi(s.value, s.decimals, s.prefix, s.suffix),
    }));
  });

  constructor() {
    afterNextRender(() => this.playCountUp());
  }

  private playCountUp(): void {
    const el = this.host.nativeElement as HTMLElement;
    const api = this.motion.gsap;
    if (!api) {
      return;
    }

    if (this.motion.prefersReducedMotion()) {
      this.displays.set(
        HOME_KPI_STATS.map((s) =>
          formatKpi(s.value, s.decimals, s.prefix, s.suffix),
        ),
      );
      return;
    }

    // Ensure plugins registered before ScrollTrigger tweens
    void this.motion.ScrollTrigger;

    const tweens: { scrollTrigger?: { kill(): void }; kill(): void }[] = [];

    HOME_KPI_STATS.forEach((meta, i) => {
      const state = { val: 0 };
      const tween = api.to(state, {
        val: meta.value,
        duration: 2.2,
        ease: 'power3.out',
        overwrite: 'auto',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
        onUpdate: () => {
          this.displays.update((list) => {
            const next = [...list];
            next[i] = formatKpi(
              state.val,
              meta.decimals,
              meta.prefix,
              meta.suffix,
            );
            return next;
          });
        },
      });
      tweens.push(tween);
    });

    this.destroyRef.onDestroy(() => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    });
  }
}
