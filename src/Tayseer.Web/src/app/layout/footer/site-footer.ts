import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../core/i18n/locale.service';
import { UiCopyService } from '../../core/i18n/ui-copy.service';
import { SOLUTION_LINKS } from '../../core/i18n/ui-copy';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  templateUrl: './site-footer.html',
})
export class SiteFooter {
  private readonly locale = inject(LocaleService);
  readonly copy = inject(UiCopyService).copy;
  readonly lang = computed(() => this.locale.lang());

  readonly services = computed(() => {
    const isAr = this.locale.lang() === 'ar';
    const lang = this.locale.lang();
    return SOLUTION_LINKS.map((item) => {
      const path =
        item.slug === 'software-management-systems'
          ? `/${lang}/software-development`
          : item.slug === 'managed-services'
            ? `/${lang}/managed-services`
            : `/${lang}/solutions/${item.slug}`;
      return {
        path,
        title: isAr ? item.titleAr : item.titleEn,
      };
    });
  });
}
