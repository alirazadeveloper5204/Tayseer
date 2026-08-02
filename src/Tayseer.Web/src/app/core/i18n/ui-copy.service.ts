import { Injectable, computed, inject } from '@angular/core';
import { LocaleService } from './locale.service';
import { UI_COPY } from './ui-copy';

@Injectable({ providedIn: 'root' })
export class UiCopyService {
  private readonly locale = inject(LocaleService);

  readonly copy = computed(() => UI_COPY[this.locale.lang()]);
}
