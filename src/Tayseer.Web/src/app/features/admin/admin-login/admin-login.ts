import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly email = signal('admin@tayseer.me');
  readonly password = signal('');
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  submit(): void {
    if (this.busy()) {
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    this.auth.login({ email: this.email().trim(), password: this.password() }).subscribe({
      next: () => {
        this.busy.set(false);
        void this.router.navigateByUrl('/admin');
      },
      error: () => {
        this.busy.set(false);
        this.error.set('Invalid email or password.');
      },
    });
  }
}
