import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { LocaleService } from '../../../core/i18n/locale.service';

@Component({
  selector: 'app-placeholder-page',
  imports: [RouterLink],
  template: `
    <section class="site-band">
      <div class="site-container py-fluid-2xl">
        <p class="type-eyebrow">Phase 1</p>
        <h1 class="type-title mt-fluid-sm">{{ title() }}</h1>
        <p class="type-lead mt-fluid-md max-w-2xl">
          Full CMS content for this page lands in Phase 2–3. Navigation and shell are live.
        </p>
        <a [routerLink]="homeLink()" class="btn-brand mt-fluid-lg inline-flex">Back to Home</a>
      </div>
    </section>
  `,
})
export class PlaceholderPage {
  private readonly route = inject(ActivatedRoute);
  private readonly locale = inject(LocaleService);

  private readonly data = toSignal(this.route.data, {
    initialValue: {} as Record<string, string>,
  });
  private readonly slug = toSignal(this.route.paramMap.pipe(map((p) => p.get('slug'))), {
    initialValue: null as string | null,
  });

  readonly homeLink = computed(() => `/${this.locale.lang()}`);

  readonly title = computed(() => {
    const data = this.data();
    const isAr = this.locale.lang() === 'ar';
    const base = isAr ? data['titleAr'] : data['titleEn'];
    const slug = this.slug();
    return slug ? `${base ?? 'Solution'}: ${slug}` : (base ?? 'Page');
  });
}
