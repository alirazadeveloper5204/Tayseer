import { Injectable, PLATFORM_ID, inject, DestroyRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION } from './motion-tokens';

gsap.registerPlugin(CSSPlugin);

@Injectable({ providedIn: 'root' })
export class GsapService {
  private readonly platformId = inject(PLATFORM_ID);
  private registered = false;

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  get gsap(): typeof gsap | null {
    if (!this.isBrowser) {
      return null;
    }
    this.ensurePlugins();
    return gsap;
  }

  get ScrollTrigger(): typeof ScrollTrigger | null {
    if (!this.isBrowser) {
      return null;
    }
    this.ensurePlugins();
    return ScrollTrigger;
  }

  timeline(destroyRef?: DestroyRef, vars?: gsap.TimelineVars): gsap.core.Timeline | null {
    const api = this.gsap;
    if (!api) {
      return null;
    }
    const tl = api.timeline(vars);
    destroyRef?.onDestroy(() => tl.kill());
    return tl;
  }

  zoomIn(target: gsap.TweenTarget, scale = 1.08): gsap.core.Tween | null {
    const api = this.gsap;
    const el = this.resolveElement(target);
    if (!api || !el || !this.canHoverZoom()) {
      return null;
    }
    return api.to(el, {
      scale,
      duration: MOTION.duration.slider,
      ease: MOTION.ease.out,
      overwrite: 'auto',
      force3D: true,
    });
  }

  zoomOut(target: gsap.TweenTarget): gsap.core.Tween | null {
    const api = this.gsap;
    const el = this.resolveElement(target);
    if (!api || !el) {
      return null;
    }
    return api.to(el, {
      scale: 1,
      duration: 0.55,
      ease: MOTION.ease.out,
      overwrite: 'auto',
      force3D: true,
    });
  }

  prefersReducedMotion(): boolean {
    if (!this.isBrowser) {
      return true;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  canHoverZoom(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    return fine && !this.prefersReducedMotion();
  }

  private resolveElement(target: gsap.TweenTarget): Element | null {
    if (!target) {
      return null;
    }
    if (target instanceof Element) {
      return target;
    }
    if (typeof HTMLElement !== 'undefined' && target instanceof HTMLElement) {
      return target;
    }
    if (typeof target === 'object' && target !== null && 'nativeElement' in target) {
      const native = (target as { nativeElement: unknown }).nativeElement;
      return native instanceof Element ? native : null;
    }
    return null;
  }

  private ensurePlugins(): void {
    if (this.registered || !this.isBrowser) {
      return;
    }
    gsap.registerPlugin(CSSPlugin, ScrollTrigger);
    this.registered = true;
  }
}
