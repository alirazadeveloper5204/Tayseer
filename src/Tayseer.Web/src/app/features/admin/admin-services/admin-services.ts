import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminApiService } from '../../../core/api/admin-api.service';
import { AdminServiceListItem } from '../../../models/admin.model';

@Component({
  selector: 'app-admin-services',
  imports: [RouterLink],
  templateUrl: './admin-services.html',
  styleUrl: '../admin-shared.css',
})
export class AdminServicesPage implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly items = signal<AdminServiceListItem[]>([]);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.api.listServices().subscribe({
      next: (items) => this.items.set(items),
      error: () => this.error.set('Failed to load services.'),
    });
  }

  remove(item: AdminServiceListItem): void {
    if (!confirm(`Delete service “${item.titleEn}”?`)) {
      return;
    }
    this.api.deleteService(item.id).subscribe({
      next: () => this.reload(),
      error: () => this.error.set('Failed to delete service.'),
    });
  }
}
