import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminApiService } from '../../../core/api/admin-api.service';
import { KnowledgeStatus } from '../../../models/admin.model';

@Component({
  selector: 'app-admin-knowledge',
  imports: [DatePipe],
  templateUrl: './admin-knowledge.html',
  styleUrl: '../admin-shared.css',
})
export class AdminKnowledgePage implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly status = signal<KnowledgeStatus | null>(null);
  readonly busy = signal(false);
  readonly message = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.api.knowledgeStatus().subscribe({
      next: (status) => this.status.set(status),
      error: () => this.error.set('Failed to load knowledge status.'),
    });
  }

  reindex(): void {
    if (this.busy()) {
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    this.message.set(null);
    this.api.reindexKnowledge().subscribe({
      next: (res) => {
        this.busy.set(false);
        this.message.set(`Reindexed ${res.chunkCount} chunks.`);
        this.reload();
      },
      error: () => {
        this.busy.set(false);
        this.error.set('Reindex failed. Is Ollama running with the embedding model?');
      },
    });
  }
}
