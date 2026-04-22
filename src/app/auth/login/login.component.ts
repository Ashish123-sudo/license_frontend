import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'], // ✅ FIXED
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  hidePassword = true;
  loading = false;
  errorMessage = '';
  year = new Date().getFullYear();

  features = [
    { icon: 'business', label: 'Manage organizations & onboarding' },
    { icon: 'vpn_key', label: 'Issue and track license keys' },
    { icon: 'contacts', label: 'Manage organization contacts' },
    { icon: 'admin_panel_settings', label: 'Role-based access control' },
  ];

  // ✅ NON-NULLABLE FORM (BEST PRACTICE)
  form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  login() {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    // ✅ FORCE string type (no undefined possible)
    const username = this.form.controls.username.value;
    const password = this.form.controls.password.value;

    this.auth.login(username, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || 'Invalid username or password. Please try again.';
      },
    });
  }
}