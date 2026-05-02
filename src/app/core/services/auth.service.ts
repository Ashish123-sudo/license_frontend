import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

export interface User {
  userId: string;       // ← add this
  fullName: string;
  roleName: string;
  permissions: string[];
  assignedAppIds: string[] | null;
}

export interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private _currentUser = signal<User | null>(this.loadUser());
  private router = inject(Router);
  readonly currentUser = this._currentUser;
  readonly isLoggedIn = computed(() => this._currentUser() !== null);

  login(username: string, password: string): Observable<LoginResponse> {

    // ✅ REAL API CALL
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this._currentUser.set(res.user);
        })
      );
  }

    logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._currentUser.set(null);
    this.router.navigate(['/auth']); // ← force navigation here
  }

  hasRole(role: string): boolean {
    return this._currentUser()?.roleName === role;
  }

  hasPermission(permission: string): boolean {
    return this._currentUser()?.permissions?.includes(permission) ?? false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLmsAdmin(): boolean {
    return this._currentUser()?.roleName === 'LMS_ADMIN';
  }

  isProductAdmin(): boolean {
    return this._currentUser()?.roleName === 'PRODUCT_ADMIN';
  }

  getAssignedAppIds(): string[] {
    return this._currentUser()?.assignedAppIds ?? [];
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}