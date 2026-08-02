import { Injectable, signal } from '@angular/core';

/** Shared chrome scroll state (e.g. mobile nav offset under a collapsed utility bar). */
@Injectable({ providedIn: 'root' })
export class ChromeScrollService {
  readonly topBarHidden = signal(false);
}
