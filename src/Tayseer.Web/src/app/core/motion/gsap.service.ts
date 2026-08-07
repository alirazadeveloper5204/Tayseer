import { Injectable, PLATFORM_ID, inject, DestroyRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION } from './motion-tokens';


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


  zoomIn(target: gsap.TweenTarget, scale = 1.08): gsap.core.Tween | null {
    const api = this.gsap;
    if (!api || !target || !this.canHoverZoom()) {
      return null;
    }
    return api.to(target, {
      scale,
      duration: MOTION.duration.slider,
      ease: MOTION.ease.out,
      overwrite: 'auto',
      force3D: true,
    });
  }


  zoomOut(target: gsap.TweenTarget): gsap.core.Tween | null {
    const api = this.gsap;
    if (!api || !target) {
      return null;
    }
    return api.to(target, {
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

  private ensurePlugins(): void {
    if (this.registered || !this.isBrowser) {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    this.registered = true;
  }
}
