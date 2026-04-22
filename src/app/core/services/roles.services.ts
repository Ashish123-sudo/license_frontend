import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
export interface Role {
  roleId?: string;
  name: string;
  description: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class RoleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/roles`;

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  getById(id: string): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }

  create(role: Omit<Role, 'roleId'>): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, role);
  }

  update(id: string, role: Partial<Role>): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/${id}`, role);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}