import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  fullName: string;
  roleName: string;
  permissions: string[];
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

  readonly currentUser = this._currentUser;
  readonly isLoggedIn = computed(() => this._currentUser() !== null);

  login(username: string, password: string): Observable<LoginResponse> {

    // ✅ HARDCODED ADMIN LOGIN
    if (username === 'admin' && password === 'admin123') {
      const mockResponse: LoginResponse = {
        token: 'mock-token-123',
        user: {
          fullName: 'Admin User',
          roleName: 'PRODUCT_ADMIN',
          permissions: [
            'VIEW_USERS',
            'VIEW_ROLES',
            'VIEW_LICENSES'
          ]
        }
      };

      return new Observable((observer) => {
        localStorage.setItem('token', mockResponse.token);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));
        this._currentUser.set(mockResponse.user);

        observer.next(mockResponse);
        observer.complete();
      });
    }

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

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}