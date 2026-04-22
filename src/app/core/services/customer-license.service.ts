import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
export interface CustomerLicense {
  customerLicenseId?: string;
  application?:       { appId: string; appName?: string };
  organization?:      { orgId: string; orgName?: string };
  licenseType?:       { licenseTypeId: string; pricingPlan?: string; pricingLimit?: number; limitUom?: string };
  licenseCount:       number;
  isActive:           boolean;
}

export type CreateCustomerLicensePayload = {
  application:  { appId: string };
  organization: { orgId: string };
  licenseType:  { licenseTypeId: string };
  licenseCount: number;
  isActive:     boolean;
};

@Injectable({ providedIn: 'root' })
export class CustomerLicenseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/customer-licenses`;

  getCustomerLicenses(): Observable<CustomerLicense[]> {
    return this.http.get<CustomerLicense[]>(this.apiUrl);
  }

  getById(id: string): Observable<CustomerLicense> {
    return this.http.get<CustomerLicense>(`${this.apiUrl}/${id}`);
  }

  createCustomerLicense(payload: CreateCustomerLicensePayload): Observable<CustomerLicense> {
    return this.http.post<CustomerLicense>(this.apiUrl, payload);
  }

  update(id: string, payload: Partial<CreateCustomerLicensePayload>): Observable<CustomerLicense> {
    
    return this.http.put<CustomerLicense>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}