import { Injectable, signal } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class ChromeScrollService {
  readonly topBarHidden = signal(false);
}
