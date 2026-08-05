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
import { ServicesBento } from '../services/services-bento';
import { HomeStory } from './home-story/home-story';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, ServicesBento, HomeStory],
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

    const sequence = hero.querySelectorAll(
      '.home-hero__eyebrow, .home-hero__title, .home-hero__lead, .home-hero__cta, .home-hero__trust',
    );

    if (sequence.length) {
      tl.fromTo(
        sequence,
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.16,
          ease: 'power3.out',
        },
      );
    }

    tl.eventCallback('onComplete', () => {
      hero.classList.add('home-hero--revealed');
    });
  }
}
