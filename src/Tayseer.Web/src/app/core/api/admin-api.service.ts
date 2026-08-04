import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AdminOffice,
  AdminServiceDetail,
  AdminServiceListItem,
  KnowledgeStatus,
  UpsertAdminOffice,
  UpsertAdminService,
} from '../../models/admin.model';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  private get baseUrl(): string {
    return isPlatformBrowser(this.platformId)
      ? environment.apiBaseUrl
      : environment.ssrApiBaseUrl;
  }

  listServices(): Observable<AdminServiceListItem[]> {
    return this.http.get<AdminServiceListItem[]>(`${this.baseUrl}/api/v1/admin/services`);
  }

  getService(id: string): Observable<AdminServiceDetail> {
    return this.http.get<AdminServiceDetail>(`${this.baseUrl}/api/v1/admin/services/${id}`);
  }

  createService(body: UpsertAdminService): Observable<AdminServiceDetail> {
    return this.http.post<AdminServiceDetail>(`${this.baseUrl}/api/v1/admin/services`, body);
  }

  updateService(id: string, body: UpsertAdminService): Observable<AdminServiceDetail> {
    return this.http.put<AdminServiceDetail>(`${this.baseUrl}/api/v1/admin/services/${id}`, body);
  }

  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/v1/admin/services/${id}`);
  }

  listOffices(): Observable<AdminOffice[]> {
    return this.http.get<AdminOffice[]>(`${this.baseUrl}/api/v1/admin/offices`);
  }

  createOffice(body: UpsertAdminOffice): Observable<AdminOffice> {
    return this.http.post<AdminOffice>(`${this.baseUrl}/api/v1/admin/offices`, body);
  }

  updateOffice(id: string, body: UpsertAdminOffice): Observable<AdminOffice> {
    return this.http.put<AdminOffice>(`${this.baseUrl}/api/v1/admin/offices/${id}`, body);
  }

  deleteOffice(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/v1/admin/offices/${id}`);
  }

  knowledgeStatus(): Observable<KnowledgeStatus> {
    return this.http.get<KnowledgeStatus>(`${this.baseUrl}/api/v1/chat/knowledge`);
  }

  reindexKnowledge(): Observable<{ chunkCount: number }> {
    return this.http.post<{ chunkCount: number }>(`${this.baseUrl}/api/v1/chat/knowledge/reindex`, {});
  }
}
