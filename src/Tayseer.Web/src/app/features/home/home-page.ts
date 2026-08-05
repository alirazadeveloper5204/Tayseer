import { Component, effect, inject } from '@angular/core';
import { LocaleService } from '../../core/i18n/locale.service';
import { ContentStore } from '../../state/content.store';
import { ServicesBento } from '../services/services-bento';
import { HomeHero } from './home-hero/home-hero';
import { HomeStory } from './home-story/home-story';

@Component({
  selector: 'app-home-page',
  imports: [HomeHero, ServicesBento, HomeStory],
  templateUrl: './home-page.html',
})
export class HomePage {
  private readonly locale = inject(LocaleService);
  private readonly store = inject(ContentStore);

  constructor() {
    effect(() => {
      this.locale.lang();
      this.store.reloadForLocale();
    });
  }
}
