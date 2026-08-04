import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../core/i18n/locale.service';
import { CONTACT_PAGE, PAGE_COMMON, t, type PageLocale } from '../../core/content/page-content';

@Component({
  selector: 'app-contact-page',
  imports: [RouterLink, FormsModule],
  templateUrl: './contact-page.html',
})
export class ContactPage {
  private readonly locale = inject(LocaleService);
  readonly lang = computed(() => this.locale.lang() as PageLocale);
  readonly c = CONTACT_PAGE;
  readonly common = PAGE_COMMON;

  readonly step = signal(1);
  readonly submitted = signal(false);
  private readonly touched = signal(false);

  readonly name = signal('');
  readonly email = signal('');
  readonly company = signal('');
  readonly interest = signal('');
  readonly message = signal('');

  readonly title = computed(() => t(this.c.title, this.lang()));
  readonly eyebrow = computed(() => t(this.c.eyebrow, this.lang()));
  readonly lead = computed(() => t(this.c.lead, this.lang()));
  readonly officesTitle = computed(() => t(this.c.officesTitle, this.lang()));
  readonly successTitle = computed(() => t(this.common.submittedTitle, this.lang()));
  readonly successBody = computed(() => t(this.common.submitted, this.lang()));

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

  interestError(): string {
    if (this.step() !== 2 || !this.touched()) return '';
    return this.interest().trim() ? '' : t(this.c.errors.interest, this.lang());
  }

  messageError(): string {
    if (this.step() !== 3 || !this.touched()) return '';
    return this.message().trim() ? '' : t(this.c.errors.message, this.lang());
  }
}
