import { Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../core/i18n/locale.service';
import { UiCopyService } from '../../core/i18n/ui-copy.service';
import { ContentStore } from '../../state/content.store';
import { TrustStrip } from '../../shared/ui/trust-strip/trust-strip';
import { ServicesBento } from '../services/services-bento';
import { HomeStory } from './home-story/home-story';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, TrustStrip, ServicesBento, HomeStory],
  templateUrl: './home-page.html',
})
export class HomePage {
  private readonly locale = inject(LocaleService);
  private readonly store = inject(ContentStore);
  readonly copy = inject(UiCopyService).copy;
  readonly lang = computed(() => this.locale.lang());

  constructor() {
    effect(() => {
      const _lang = this.locale.lang();
      this.store.reloadForLocale();
    });
  }
}
