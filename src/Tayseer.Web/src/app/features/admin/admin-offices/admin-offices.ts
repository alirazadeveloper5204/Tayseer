import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/api/admin-api.service';
import { AdminOffice, UpsertAdminOffice } from '../../../models/admin.model';

@Component({
  selector: 'app-admin-offices',
  imports: [FormsModule],
  templateUrl: './admin-offices.html',
  styleUrl: '../admin-shared.css',
})
export class AdminOfficesPage implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly items = signal<AdminOffice[]>([]);
  readonly error = signal<string | null>(null);
  readonly editingId = signal<string | null>(null);
  readonly busy = signal(false);

  model: UpsertAdminOffice = this.blank();

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.api.listOffices().subscribe({
      next: (items) => this.items.set(items),
      error: () => this.error.set('Failed to load offices.'),
    });
  }

  startCreate(): void {
    this.editingId.set(null);
    this.model = this.blank();
  }

  startEdit(item: AdminOffice): void {
    this.editingId.set(item.id);
    this.model = {
      countryCode: item.countryCode,
      titleEn: item.titleEn,
      titleAr: item.titleAr,
      addressEn: item.addressEn,
      addressAr: item.addressAr,
      phone: item.phone,
      email: item.email,
      sortOrder: item.sortOrder,
    };
  }

  save(): void {
    if (this.busy()) {
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    const id = this.editingId();
    const req$ = id ? this.api.updateOffice(id, this.model) : this.api.createOffice(this.model);
    req$.subscribe({
      next: () => {
        this.busy.set(false);
        this.startCreate();
        this.reload();
      },
      error: () => {
        this.busy.set(false);
        this.error.set('Failed to save office.');
      },
    });
  }

  remove(item: AdminOffice): void {
    if (!confirm(`Delete office “${item.titleEn}”?`)) {
      return;
    }
    this.api.deleteOffice(item.id).subscribe({
      next: () => this.reload(),
      error: () => this.error.set('Failed to delete office.'),
    });
  }

  private blank(): UpsertAdminOffice {
    return {
      countryCode: '',
      titleEn: '',
      titleAr: '',
      addressEn: '',
      addressAr: '',
      phone: '',
      email: '',
      sortOrder: 0,
    };
  }
}
