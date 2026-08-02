import { Component, computed, inject } from '@angular/core';
import { UiCopyService } from '../../../core/i18n/ui-copy.service';

@Component({
  selector: 'app-trust-strip',
  templateUrl: './trust-strip.html',
})
export class TrustStrip {
  private readonly copyService = inject(UiCopyService);

  readonly items = computed(() => {
    const t = this.copyService.copy().trust;
    return [
      { label: t.iso, accent: 'blue' as const },
      { label: t.regions, accent: 'blue' as const },
      { label: t.since, accent: 'blue' as const },
      { label: t.focus, accent: 'green' as const },
    ];
  });
}
