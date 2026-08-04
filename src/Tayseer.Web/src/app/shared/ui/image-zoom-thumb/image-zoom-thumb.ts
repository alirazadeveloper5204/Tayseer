import { Component, inject, input, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GsapService } from '../../../core/motion/gsap.service';

/**
 * Compact image frame with GSAP hover-zoom (power3.out).
 * Shared by services-bento thumbs and trust-strip logos.
 */
@Component({
  selector: 'app-image-zoom-thumb',
  imports: [RouterLink],
  template: `
    @if (link(); as href) {
      <a
        [routerLink]="href"
        class="image-zoom-thumb group relative block h-full w-full overflow-hidden"
        (pointerenter)="onEnter()"
        (pointerleave)="onLeave()"
      >
        <img
          #zoomImg
          class="image-zoom-thumb__img h-full w-full object-cover"
          [src]="src()"
          [alt]="alt()"
          [attr.width]="width()"
          [attr.height]="height()"
          loading="lazy"
          decoding="async"
        />
        @if (showVeil()) {
          <span
            class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
            aria-hidden="true"
          ></span>
        }
        <ng-content />
      </a>
    } @else {
      <div
        class="image-zoom-thumb relative h-full w-full overflow-hidden"
        (pointerenter)="onEnter()"
        (pointerleave)="onLeave()"
      >
        <img
          #zoomImg
          class="image-zoom-thumb__img h-full w-full object-cover"
          [src]="src()"
          [alt]="alt()"
          [attr.width]="width()"
          [attr.height]="height()"
          loading="lazy"
          decoding="async"
        />
        @if (showVeil()) {
          <span
            class="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-blue/25 to-transparent dark:from-brand-blue/40"
            aria-hidden="true"
          ></span>
        }
        <ng-content />
      </div>
    }
  `,
  host: {
    class: 'block h-full w-full',
  },
})
export class ImageZoomThumb {
  private readonly motion = inject(GsapService);

  readonly src = input.required<string>();
  readonly alt = input('');
  readonly link = input<string | null>(null);
  readonly width = input(140);
  readonly height = input(96);
  readonly showVeil = input(false);
  readonly scale = input(1.08);

  private readonly zoomImg = viewChild<HTMLImageElement>('zoomImg');

  onEnter(): void {
    const img = this.zoomImg();
    if (img) {
      this.motion.zoomIn(img, this.scale());
    }
  }

  onLeave(): void {
    const img = this.zoomImg();
    if (img) {
      this.motion.zoomOut(img);
    }
  }
}
