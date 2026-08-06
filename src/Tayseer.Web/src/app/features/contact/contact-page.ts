import { Component, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LocaleService } from '../../core/i18n/locale.service';
import { UiCopyService } from '../../core/i18n/ui-copy.service';
import { scrollToSectionId } from '../../core/navigation/scroll-to-section';
import { CONTACT_PAGE, PAGE_COMMON, t, type PageLocale } from '../../core/content/page-content';

@Component({
  selector: 'app-contact-page',
  imports: [FormsModule],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css',
})
export class ContactPage {
  private readonly locale = inject(LocaleService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly ui = inject(UiCopyService);
  private readonly platformId = inject(PLATFORM_ID);
  readonly lang = computed(() => this.locale.lang() as PageLocale);
  readonly c = CONTACT_PAGE;
  readonly common = PAGE_COMMON;

  readonly step = signal(1);
  readonly submitted = signal(false);
  private readonly touched = signal(false);
  readonly activeOffice = signal(0);

  readonly name = signal('');
  readonly email = signal('');
  readonly company = signal('');
  readonly interest = signal('');
  readonly message = signal('');

  readonly title = computed(() => t(this.c.title, this.lang()));
  readonly eyebrow = computed(() => t(this.c.eyebrow, this.lang()));
  readonly lead = computed(() => t(this.c.lead, this.lang()));
  readonly heroCta = computed(() => t(this.c.heroCta, this.lang()));
  readonly heroEmail = computed(() => t(this.c.heroEmail, this.lang()));
  readonly heroMetaResponse = computed(() => t(this.c.heroMetaResponse, this.lang()));
  readonly heroMetaCoverage = computed(() => t(this.c.heroMetaCoverage, this.lang()));
  readonly heroMetaSince = computed(() => t(this.c.heroMetaSince, this.lang()));
  readonly officesTitle = computed(() => t(this.c.officesTitle, this.lang()));
  readonly mapTitle = computed(() => t(this.c.mapTitle, this.lang()));
  readonly mapOpen = computed(() => t(this.c.mapOpen, this.lang()));
  readonly successTitle = computed(() => t(this.common.submittedTitle, this.lang()));
  readonly successBody = computed(() => t(this.common.submitted, this.lang()));
  readonly teamEmail = computed(() => this.ui.copy().common.email);

  readonly selectedOffice = computed(() => this.c.offices[this.activeOffice()] ?? this.c.offices[0]);

  readonly mapEmbedUrl = computed(() => {
    const office = this.selectedOffice();
    const hl = this.lang() === 'ar' ? 'ar' : 'en';
    const src = `https://maps.google.com/maps?q=${encodeURIComponent(office.query)}&hl=${hl}&z=16&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  });

  readonly mapExternalUrl = computed(() => {
    const office = this.selectedOffice();
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.query)}`;
  });

  readonly nameError = computed(() => {
    if (!this.touched() || this.step() !== 1) return '';
    return this.name().trim().length < 2 ? t(this.c.errors.name, this.lang()) : '';
  });

  readonly emailError = computed(() => {
    if (!this.touched() || this.step() !== 1) return '';
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email().trim());
    return ok ? '' : t(this.c.errors.email, this.lang());
  });

  label(item: { en: string; ar: string }): string {
    return t(item, this.lang());
  }

  selectOffice(index: number): void {
    this.activeOffice.set(index);
  }

  telHref(phone: string): string {
    return `tel:${phone.replace(/\s+/g, '')}`;
  }

  startInquiry(event: Event): void {
    scrollToSectionId(this.platformId, 'contact-inquiry', event);
  }

  next(): void {
    this.touched.set(true);
    if (this.step() === 1) {
      if (this.name().trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email().trim())) {
        return;
      }
      this.step.set(2);
      this.touched.set(false);
      return;
    }
    if (this.step() === 2) {
      if (!this.interest().trim()) return;
      this.step.set(3);
      this.touched.set(false);
    }
  }

  back(): void {
    this.step.update((s) => Math.max(1, s - 1));
    this.touched.set(false);
  }

  submit(): void {
    this.touched.set(true);
    if (!this.message().trim()) return;
    this.submitted.set(true);
  }

  /** Reset the wizard on the same page — never navigate away after submit. */
  submitAnother(): void {
    this.submitted.set(false);
    this.step.set(1);
    this.touched.set(false);
    this.name.set('');
    this.email.set('');
    this.company.set('');
    this.interest.set('');
    this.message.set('');
  }

  onFormSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.step() < 3) {
      this.next();
      return;
    }
    this.submit();
  }

  interestError(): string {
    if (this.step() !== 2 || !this.touched()) return '';
    return this.interest().trim() ? '' : t(this.c.errors.interest, this.lang());
  }

  messageError(): string {
    if (this.step() !== 3 || !this.touched()) return '';
    return this.message().trim() ? '' : t(this.c.errors.message, this.lang());
  }
}
