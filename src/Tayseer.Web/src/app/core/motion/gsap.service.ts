import { Injectable, PLATFORM_ID, inject, DestroyRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Browser-only GSAP access for the Tayseer portal.
 * Safe with Angular SSR — methods no-op on the server.
 *
 * @example
 * private readonly motion = inject(GsapService);
 * private readonly destroyRef = inject(DestroyRef);
 *
 * afterNextRender(() => {
 *   const tl = this.motion.timeline(this.destroyRef);
 *   tl?.from('.card', { y: 24, autoAlpha: 0, stagger: 0.08 });
 * });
 */
@Injectable({ providedIn: 'root' })
export class GsapService {
  private readonly platformId = inject(PLATFORM_ID);
  private registered = false;

  /** True only in the browser (GSAP DOM APIs available). */
  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /** Core GSAP instance (null during SSR). */
  get gsap(): typeof gsap | null {
    if (!this.isBrowser) {
      return null;
    }
    this.ensurePlugins();
    return gsap;
  }

  /** ScrollTrigger plugin (null during SSR). */
  get ScrollTrigger(): typeof ScrollTrigger | null {
    if (!this.isBrowser) {
      return null;
    }
    this.ensurePlugins();
    return ScrollTrigger;
  }

  /** Create a timeline; pass the component DestroyRef to auto-kill on destroy. */
  timeline(
    destroyRef?: DestroyRef,
    vars?: gsap.TimelineVars,
  ): gsap.core.Timeline | null {
    const api = this.gsap;
    if (!api) {
      return null;
    }
    const tl = api.timeline(vars);
    destroyRef?.onDestroy(() => tl.kill());
    return tl;
  }

  /** Fade + slight rise — common portal entrance. */
  fadeUp(
    targets: gsap.TweenTarget,
    vars?: gsap.TweenVars,
  ): gsap.core.Tween | null {
    const api = this.gsap;
    if (!api) {
      return null;
    }
    return api.fromTo(
      targets,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        ...vars,
      },
    );
  }

  /** Stagger children into view (cards, thumbs, etc.). */
  staggerIn(
    targets: gsap.TweenTarget,
    vars?: gsap.TweenVars,
  ): gsap.core.Tween | null {
    const api = this.gsap;
    if (!api) {
      return null;
    }
    return api.from(targets, {
      autoAlpha: 0,
      y: 24,
      duration: 0.55,
      stagger: 0.08,
      ease: 'power2.out',
      ...vars,
    });
  }

  /** Smooth image zoom-in (use inside overflow:hidden frames only). */
  zoomIn(target: gsap.TweenTarget, scale = 1.08): gsap.core.Tween | null {
    const api = this.gsap;
    if (!api || !target || !this.canHoverZoom()) {
      return null;
    }
    return api.to(target, {
      scale,
      duration: 0.6,
      ease: 'power3.out',
      overwrite: 'auto',
      force3D: true,
    });
  }

  /** Smooth image zoom-out back to rest. */
  zoomOut(target: gsap.TweenTarget): gsap.core.Tween | null {
    const api = this.gsap;
    if (!api || !target) {
      return null;
    }
    return api.to(target, {
      scale: 1,
      duration: 0.55,
      ease: 'power3.out',
      overwrite: 'auto',
      force3D: true,
    });
  }

  /** Skip zoom on touch / reduced-motion devices. */
  private canHoverZoom(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return fine && !reduce;
  }

  /** Kill all active ScrollTriggers (e.g. on locale/route change). */
  killScrollTriggers(): void {
    if (!this.isBrowser) {
      return;
    }
    ScrollTrigger.getAll().forEach((t: ScrollTrigger) => t.kill());
  }

  private ensurePlugins(): void {
    if (this.registered || !this.isBrowser) {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    this.registered = true;
  }
}
