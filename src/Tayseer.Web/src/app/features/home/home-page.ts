import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../core/i18n/locale.service';
import { UiCopyService } from '../../core/i18n/ui-copy.service';
import { GsapService } from '../../core/motion/gsap.service';
import { ContentStore } from '../../state/content.store';
import { TrustStrip } from '../../shared/ui/trust-strip/trust-strip';
import { ServicesBento } from '../services/services-bento';
import { HomeStory } from './home-story/home-story';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, TrustStrip, ServicesBento, HomeStory],
  templateUrl: './home-page.html',
})
export class HomePage {
  private readonly locale = inject(LocaleService);
  private readonly store = inject(ContentStore);
  private readonly motion = inject(GsapService);
  private readonly destroyRef = inject(DestroyRef);
  readonly copy = inject(UiCopyService).copy;
  readonly lang = computed(() => this.locale.lang());

  constructor() {
    effect(() => {
      const _lang = this.locale.lang();
      this.store.reloadForLocale();
    });

    afterNextRender(() => this.playHeroEntrance());
  }

  private playHeroEntrance(): void {
    const hero = document.querySelector('.home-hero');
    if (!hero) {
      return;
    }

    if (this.motion.prefersReducedMotion()) {
      hero.classList.add('home-hero--revealed');
      return;
    }

    const api = this.motion.gsap;
    const tl = this.motion.timeline(this.destroyRef);
    if (!api || !tl) {
      hero.classList.add('home-hero--revealed');
      return;
    }

    const eyebrow = hero.querySelector('.home-hero__eyebrow');
    const title = hero.querySelector('.home-hero__title');
    const lead = hero.querySelector('.home-hero__lead');
    const ctas = hero.querySelectorAll('.home-hero__cta-item');

    if (eyebrow) {
      tl.fromTo(
        eyebrow,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      );
    }
    if (title) {
      tl.fromTo(
        title,
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.3',
      );
    }
    if (lead) {
      tl.fromTo(
        lead,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out' },
        '-=0.4',
      );
    }
    if (ctas.length) {
      tl.fromTo(
        ctas,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power2.out',
        },
        '-=0.3',
      );
    }

    tl.eventCallback('onComplete', () => {
      hero.classList.add('home-hero--revealed');
    });
  }
}
