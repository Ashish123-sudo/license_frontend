import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
export interface Contact {
  contactId?:       string;
  organization?:    { orgId: string; orgName?: string };
  firstName:        string;
  lastName:         string;
  designation?:     string;
  role?:            string;
  email?:           string;
  mobile?:          string;
  officePhone?:     string;
  ext?:             string;
  fax?:             string;
  linkedIn?:        string;
  isActive:         boolean;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/v1/organization-contacts`;

  getAll(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.base);
  }

  getById(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.base}/${id}`);
  }

  getByOrg(orgId: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.base}/organization/${orgId}`);
  }

  create(orgId: string, contact: Partial<Contact>): Observable<Contact> {
    return this.http.post<Contact>(`${this.base}?orgId=${orgId}`, contact);
  }

  update(id: string, contact: Partial<Contact>): Observable<Contact> {
    return this.http.put<Contact>(`${this.base}/${id}`, contact);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  toggleActive(id: string): Observable<Contact> {
    return this.http.patch<Contact>(`${this.base}/${id}/toggle-status`, {});
  }
}