import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminApiService } from '../../../core/api/admin-api.service';
import { KnowledgeStatus } from '../../../models/admin.model';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: '../admin-shared.css',
})
export class AdminDashboard implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly serviceCount = signal(0);
  readonly officeCount = signal(0);
  readonly knowledge = signal<KnowledgeStatus | null>(null);

  ngOnInit(): void {
    this.api.listServices().subscribe((items) => this.serviceCount.set(items.length));
    this.api.listOffices().subscribe((items) => this.officeCount.set(items.length));
    this.api.knowledgeStatus().subscribe((status) => this.knowledge.set(status));
  }
}
