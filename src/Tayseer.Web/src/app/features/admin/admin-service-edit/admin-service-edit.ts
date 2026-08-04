import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminApiService } from '../../../core/api/admin-api.service';
import { AdminServiceFeature, UpsertAdminService } from '../../../models/admin.model';

@Component({
  selector: 'app-admin-service-edit',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-service-edit.html',
  styleUrl: '../admin-shared.css',
})
export class AdminServiceEditPage implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly id = signal<string | null>(null);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  model: UpsertAdminService = this.blank();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || id === 'new') {
      this.id.set(null);
      return;
    }
    this.id.set(id);
    this.api.getService(id).subscribe({
      next: (service) => {
        this.model = {
          slug: service.slug,
          titleEn: service.titleEn,
          titleAr: service.titleAr,
          shortDescriptionEn: service.shortDescriptionEn,
          shortDescriptionAr: service.shortDescriptionAr,
          bodyEn: service.bodyEn,
          bodyAr: service.bodyAr,
          ctaLabelEn: service.ctaLabelEn,
          ctaLabelAr: service.ctaLabelAr,
          ctaUrl: service.ctaUrl,
          iconKey: service.iconKey,
          accentColor: service.accentColor,
          sortOrder: service.sortOrder,
          isPublished: service.isPublished,
          features: service.features.map((f) => ({ ...f })),
        };
      },
      error: () => this.error.set('Failed to load service.'),
    });
  }

  addFeature(): void {
    const next: AdminServiceFeature = {
      titleEn: '',
      titleAr: '',
      descriptionEn: '',
      descriptionAr: '',
      sortOrder: this.model.features.length + 1,
    };
    this.model.features = [...this.model.features, next];
  }

  removeFeature(index: number): void {
    this.model.features = this.model.features.filter((_, i) => i !== index);
  }

  save(): void {
    if (this.busy()) {
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    const id = this.id();
    const req$ = id
      ? this.api.updateService(id, this.model)
      : this.api.createService(this.model);

    req$.subscribe({
      next: () => {
        this.busy.set(false);
        void this.router.navigateByUrl('/admin/services');
      },
      error: () => {
        this.busy.set(false);
        this.error.set('Failed to save service.');
      },
    });
  }

  private blank(): UpsertAdminService {
    return {
      slug: '',
      titleEn: '',
      titleAr: '',
      shortDescriptionEn: '',
      shortDescriptionAr: '',
      bodyEn: '',
      bodyAr: '',
      ctaLabelEn: '',
      ctaLabelAr: '',
      ctaUrl: '',
      iconKey: '',
      accentColor: 'blue',
      sortOrder: 0,
      isPublished: true,
      features: [],
    };
  }
}
