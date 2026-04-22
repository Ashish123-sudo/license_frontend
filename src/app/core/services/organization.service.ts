import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Organization {
  orgId:        string;
  orgName:      string;
  orgCode:      string;
  address1?:    string;
  address2?:    string;
  city?:        string;
  state?:       string;
  country?:     string;
  postalCode?:  string;
  phone?:       string;
  email?:       string;
  website?:     string;
  industry?:    string;
  notes?:       string;
  isActive:     boolean;
  createdAt?:   string;
  updatedAt?:   string;
}

export interface OrgListResponse {
  content:       Organization[];
  totalElements: number;
  totalPages:    number;
  page:          number;
  size:          number;
}

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api/v1/organizations';

  // Backend returns a plain array, we wrap it to match the paginated interface
  getAll(page = 0, size = 10, search = ''): Observable<OrgListResponse> {
    return this.http.get<Organization[]>(this.base).pipe(
      map(orgs => {
        const filtered = search
          ? orgs.filter(o =>
              o.orgName.toLowerCase().includes(search.toLowerCase()) ||
              o.orgCode.toLowerCase().includes(search.toLowerCase())
            )
          : orgs;
        const start = page * size;
        return {
          content: filtered.slice(start, start + size),
          totalElements: filtered.length,
          totalPages: Math.ceil(filtered.length / size),
          page,
          size
        };
      })
    );
  }

  getById(orgId: string): Observable<Organization> {
    return this.http.get<Organization>(`${this.base}/${orgId}`);
  }

  create(org: Partial<Organization>): Observable<Organization> {
    return this.http.post<Organization>(this.base, org);
  }

  update(orgId: string, org: Partial<Organization>): Observable<Organization> {
    return this.http.put<Organization>(`${this.base}/${orgId}`, org);
  }

  delete(orgId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${orgId}`);
  }

  toggleActive(orgId: string): Observable<Organization> {
    return this.http.patch<Organization>(`${this.base}/${orgId}/toggle-status`, {});
  }
  getOrganizations(): Observable<Organization[]> {
  return this.http.get<Organization[]>(this.base);
}
}