import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LicenseType {
  licenseTypeId?: string;
  application?:   { appId: string; appName?: string };
  pricingPlan:    string;
  pricingLimit:   number;
  limitUom:       string;
  limitFrequency: number;
}

export type CreateLicenseTypePayload = {
  application: { appId: string };
  pricingPlan:    string;
  pricingLimit:   number;
  limitUom:       string;
  limitFrequency: number;
};

@Injectable({ providedIn: 'root' })
export class LicenseTypeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/license-types`;

  getLicenseTypes(): Observable<LicenseType[]> {
    return this.http.get<LicenseType[]>(this.apiUrl);
  }

  // ← new: for PRODUCT_ADMIN
  getMyTypes(): Observable<LicenseType[]> {
    return this.http.get<LicenseType[]>(`${this.apiUrl}/my-types`);
  }

  saveLicenseType(payload: CreateLicenseTypePayload): Observable<LicenseType> {
    return this.http.post<LicenseType>(this.apiUrl, payload);
  }

  getById(id: string): Observable<LicenseType> {
    return this.http.get<LicenseType>(`${this.apiUrl}/${id}`);
  }

  update(id: string, payload: Partial<CreateLicenseTypePayload>): Observable<LicenseType> {
    return this.http.put<LicenseType>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}