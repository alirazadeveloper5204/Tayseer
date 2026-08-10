import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../core/i18n/locale.service';
import { UiCopyService } from '../../core/i18n/ui-copy.service';
import { SOLUTION_LINKS } from '../../core/i18n/ui-copy';
import { solutionPath } from '../../core/content/static-services';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.css',
})
export class SiteFooter {
  private readonly locale = inject(LocaleService);
  readonly copy = inject(UiCopyService).copy;
  readonly lang = computed(() => this.locale.lang());

  readonly services = computed(() => {
    const isAr = this.locale.lang() === 'ar';
    const lang = this.locale.lang();
    return SOLUTION_LINKS.map((item) => ({
      path: solutionPath(lang, item.slug),
      title: isAr ? item.titleAr : item.titleEn,
    }));
  });
}
