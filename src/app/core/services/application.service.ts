import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Application {
  appId?:        string;
  appName:       string;
  productOwner?: { userId: string; userName?: string };
  isActive:      boolean;
}

export type CreateApplicationPayload = {
  appName:      string;
  productOwner: { userId: string };
  isActive:     boolean;
};

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/applications`;

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(this.apiUrl);
  }

  getById(id: string): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/${id}`);
  }

  create(payload: CreateApplicationPayload): Observable<Application> {
    return this.http.post<Application>(this.apiUrl, payload);
  }

  update(id: string, payload: Partial<CreateApplicationPayload>): Observable<Application> {
    return this.http.put<Application>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}