import { Component, computed, inject } from '@angular/core';
import { LocaleService } from '../../../core/i18n/locale.service';
import { HOME_HERO_PROOF } from '../../../core/i18n/ui-copy';

@Component({
  selector: 'app-proof-cards',
  templateUrl: './proof-cards.html',
  styleUrl: './proof-cards.css',
})
export class ProofCards {
  private readonly locale = inject(LocaleService);

  readonly cards = computed(() => {
    const isAr = this.locale.lang() === 'ar';
    return HOME_HERO_PROOF.map((card) => ({
      icon: card.icon,
      title: isAr ? card.titleAr : card.titleEn,
      detail: isAr ? card.detailAr : card.detailEn,
    }));
  });
}
