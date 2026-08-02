import { Component, computed, inject, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentStore } from '../../state/content.store';
import { LocaleService } from '../../core/i18n/locale.service';
import { UiCopyService } from '../../core/i18n/ui-copy.service';
import { ServiceCard } from '../../shared/ui/service-card/service-card';

@Component({
  selector: 'app-solutions-page',
  imports: [RouterLink, ServiceCard],
  templateUrl: './solutions-page.html',
})
export class SolutionsPage {
  private readonly store = inject(ContentStore);
  private readonly locale = inject(LocaleService);
  readonly copy = inject(UiCopyService).copy;
  readonly lang = computed(() => this.locale.lang());
  readonly isAr = computed(() => this.locale.lang() === 'ar');

  readonly services = this.store.services;
  readonly loading = this.store.loading;
  readonly error = this.store.error;

  readonly title = computed(() => (this.isAr() ? 'الحلول' : 'Solutions'));
  readonly intro = computed(() =>
    this.isAr()
      ? 'نقدّم مجموعة شاملة من حلول الذكاء الاصطناعي والرقمية المصممة لاحتياجات أعمالك.'
      : 'Intelligent solutions for your business — a comprehensive suite of AI and digital offerings tailored to your needs.',
  );
  readonly benefitsTitle = computed(() =>
    this.isAr() ? 'صُممت منتجاتنا وخدماتنا من أجل:' : 'Our Products & Services are designed to:',
  );
  readonly benefits = computed(() =>
    this.isAr()
      ? [
          'تبسيط العمليات ورفع الكفاءة',
          'تعزيز تجربة العملاء ورضاهم',
          'تخفيف المخاطر وضمان الأمن',
          'تبنّي الابتكار والبقاء في الطليعة',
        ]
      : [
          'Streamline Operations and Boost Efficiency',
          'Enhance Customer Experience and Satisfaction',
          'Mitigate Risk and Ensure Security',
          'Embrace Innovation and Stay Ahead of the Curve',
        ],
  );

  constructor() {
    effect(() => {
      const _ = this.locale.lang();
      this.store.reloadForLocale();
    });
  }
}
