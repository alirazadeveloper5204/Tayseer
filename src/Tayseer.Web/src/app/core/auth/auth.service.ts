import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser, LoginRequest, LoginResponse } from '../../models/admin.model';

const TOKEN_KEY = 'tayseer-admin-token';
const USER_KEY = 'tayseer-admin-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly tokenSignal = signal<string | null>(this.readToken());
  private readonly userSignal = signal<AuthUser | null>(this.readUser());

  readonly token = this.tokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  private get baseUrl(): string {
    return isPlatformBrowser(this.platformId)
      ? environment.apiBaseUrl
      : environment.ssrApiBaseUrl;
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/v1/auth/login`, request).pipe(
      tap((res) => this.persist(res)),
    );
  }

  logout(navigate = true): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    if (navigate) {
      void this.router.navigateByUrl('/admin/login');
    }
  }

  refreshMe(): Observable<AuthUser | null> {
    if (!this.tokenSignal()) {
      return of(null);
    }
    return this.http.get<AuthUser>(`${this.baseUrl}/api/v1/auth/me`).pipe(
      tap((user) => {
        this.userSignal.set(user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
      }),
      catchError(() => {
        this.logout(false);
        return of(null);
      }),
      map((user) => user),
    );
  }

  private persist(res: LoginResponse): void {
    this.tokenSignal.set(res.accessToken);
    this.userSignal.set(res.user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(TOKEN_KEY, res.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    }
  }

  private readToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  }

  private readUser(): AuthUser | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
