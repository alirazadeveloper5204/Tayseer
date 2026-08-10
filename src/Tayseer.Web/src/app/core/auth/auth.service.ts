import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser, LoginRequest, LoginResponse } from '../../models/admin.model';

/** Legacy keys — cleared so old JWTs are not left in localStorage. */
const LEGACY_TOKEN_KEY = 'tayseer-admin-token';
const LEGACY_USER_KEY = 'tayseer-admin-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly userSignal = signal<AuthUser | null>(null);
  private readonly sessionResolved = signal(false);
  private sessionCheck$: Observable<boolean> | null = null;

  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.userSignal());

  private get baseUrl(): string {
    return isPlatformBrowser(this.platformId)
      ? environment.apiBaseUrl
      : environment.ssrApiBaseUrl;
  }

  private get httpOpts() {
    return { withCredentials: true as const };
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/api/v1/auth/login`, request, this.httpOpts)
      .pipe(
        tap((res) => {
          this.clearLegacyStorage();
          this.userSignal.set(res.user);
          this.sessionResolved.set(true);
          this.sessionCheck$ = null;
        }),
      );
  }

  logout(navigate = true): void {
    const finish = () => {
      this.userSignal.set(null);
      this.sessionResolved.set(true);
      this.sessionCheck$ = null;
      this.clearLegacyStorage();
      if (navigate) {
        void this.router.navigateByUrl('/admin/login');
      }
    };

    if (!isPlatformBrowser(this.platformId)) {
      finish();
      return;
    }

    this.http.post(`${this.baseUrl}/api/v1/auth/logout`, {}, this.httpOpts).subscribe({
      next: () => finish(),
      error: () => finish(),
    });
  }

  /** Resolves admin session from the HttpOnly cookie (call from route guards). */
  ensureSession(): Observable<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(false);
    }

    if (this.sessionResolved()) {
      return of(!!this.userSignal());
    }

    if (!this.sessionCheck$) {
      this.sessionCheck$ = this.http
        .get<AuthUser>(`${this.baseUrl}/api/v1/auth/me`, this.httpOpts)
        .pipe(
          tap((user) => {
            this.userSignal.set(user);
            this.sessionResolved.set(true);
          }),
          map(() => true),
          catchError(() => {
            this.userSignal.set(null);
            this.sessionResolved.set(true);
            this.clearLegacyStorage();
            return of(false);
          }),
          shareReplay(1),
        );
    }

    return this.sessionCheck$;
  }

  private clearLegacyStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(LEGACY_USER_KEY);
  }
}
