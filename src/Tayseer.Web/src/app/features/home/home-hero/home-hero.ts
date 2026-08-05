import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../../core/i18n/locale.service';
import { HOME_HERO_SEGMENTS } from '../../../core/i18n/ui-copy';
import { UiCopyService } from '../../../core/i18n/ui-copy.service';
import { GsapService } from '../../../core/motion/gsap.service';
import { ProofCards } from '../../../shared/ui/proof-cards/proof-cards';

@Component({
  selector: 'app-home-hero',
  imports: [RouterLink, ProofCards],
  templateUrl: './home-hero.html',
})
export class HomeHero {
  private readonly locale = inject(LocaleService);
  private readonly motion = inject(GsapService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly copy = inject(UiCopyService).copy;
  readonly lang = computed(() => this.locale.lang());
  readonly revealed = signal(false);

  readonly segments = computed(() => {
    const isAr = this.locale.lang() === 'ar';
    return HOME_HERO_SEGMENTS.map((item) => (isAr ? item.ar : item.en));
  });

  readonly trustItems = computed(() => {
    const trust = this.copy().trust;
    return [trust.solutions, trust.cities, this.copy().home.trustSecurity, trust.since];
  });

  constructor() {
    afterNextRender(() => this.playEntrance());
  }

  private playEntrance(): void {
    const hero = this.host.nativeElement.querySelector('.home-hero');
    if (!hero) {
      return;
    }

    const reveal = () => {
      this.revealed.set(true);
      hero.classList.add('home-hero--revealed');
    };

    if (this.motion.prefersReducedMotion()) {
      reveal();
      return;
    }

    const api = this.motion.gsap;
    const tl = this.motion.timeline(this.destroyRef);
    if (!api || !tl) {
      reveal();
      return;
    }

    const text = hero.querySelectorAll(
      '.home-hero__eyebrow, .home-hero__title, .home-hero__lead, .home-hero__cta, .home-hero__segments',
    );
    const visual = hero.querySelector('.home-hero__stage');
    const cards = hero.querySelectorAll('.proof-card');
    const mobileProof = hero.querySelector('.proof-card__mobile');
    const trust = hero.querySelector('.home-hero__trust');

    api.set(text, { autoAlpha: 0, y: 14 });
    if (visual) {
      api.set(visual, { autoAlpha: 0, y: 16, scale: 0.985 });
    }
    if (cards.length) {
      api.set(cards, { autoAlpha: 0, y: 12 });
    }
    if (mobileProof) {
      api.set(mobileProof, { autoAlpha: 0, y: 12 });
    }
    if (trust) {
      api.set(trust, { autoAlpha: 0, y: 12 });
    }

    tl.to(text, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.12, ease: 'power3.out' }, 0);
    if (visual) {
      tl.to(visual, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }, 0.2);
    }
    if (cards.length) {
      tl.to(cards, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12, ease: 'power3.out' }, 0.62);
    }
    if (mobileProof) {
      tl.to(mobileProof, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 0.62);
    }
    if (trust) {
      tl.to(trust, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 0.88);
    }

    tl.eventCallback('onComplete', () => {
      api.set(text, { clearProps: 'all' });
      if (visual) {
        api.set(visual, { clearProps: 'all' });
      }
      if (cards.length) {
        api.set(cards, { clearProps: 'all' });
      }
      if (mobileProof) {
        api.set(mobileProof, { clearProps: 'all' });
      }
      if (trust) {
        api.set(trust, { clearProps: 'all' });
      }
      reveal();
    });
  }
}
