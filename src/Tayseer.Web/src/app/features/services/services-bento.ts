import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  untracked,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentStore } from '../../state/content.store';
import { LocaleService } from '../../core/i18n/locale.service';
import { UiCopyService } from '../../core/i18n/ui-copy.service';
import { GsapService } from '../../core/motion/gsap.service';
import { ServiceCard } from '../../shared/ui/service-card/service-card';

@Component({
  selector: 'app-services-bento',
  imports: [RouterLink, ServiceCard],
  templateUrl: './services-bento.html',
  styleUrl: './services-bento.css',
  encapsulation: ViewEncapsulation.None,
})
export class ServicesBento {
  private readonly store = inject(ContentStore);
  private readonly locale = inject(LocaleService);
  private readonly motion = inject(GsapService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly copy = inject(UiCopyService).copy;

  readonly lang = computed(() => this.locale.lang());
  readonly services = this.store.services;
  readonly loading = this.store.loading;
  readonly error = this.store.error;

  private readonly viewReady = signal(false);
  private revealDone = false;

  constructor() {
    afterNextRender(() => this.viewReady.set(true));

    effect(() => {
      const ready = this.viewReady();
      const count = this.services().length;
      if (!ready || count === 0 || this.revealDone) {
        return;
      }
      untracked(() => this.runCardReveal());
    });
  }

  private runCardReveal(): void {
    if (this.motion.prefersReducedMotion()) {
      this.revealDone = true;
      return;
    }

    const el = this.host.nativeElement;
    const cards = el.querySelectorAll('.service-card-host');
    if (!cards.length) {
      return;
    }

    this.revealDone = true;
    const tween = this.motion.staggerIn(cards, {
      stagger: 0.09,
      scrollTrigger: {
        trigger: el.querySelector('.services-bento__grid') ?? el,
        start: 'top 80%',
      },
    });

    this.destroyRef.onDestroy(() => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
    });
  }
}
