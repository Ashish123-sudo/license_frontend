import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LicenseType {
  licenseTypeId?: string;
  application?:   { appId: string; appName?: string }; // ✅ nested
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
  private apiUrl = 'http://localhost:8080/api/license-types'; // ✅ real URL

  getLicenseTypes(): Observable<LicenseType[]> {
    return this.http.get<LicenseType[]>(this.apiUrl); // ✅ real API call
  }

  saveLicenseType(payload: CreateLicenseTypePayload): Observable<LicenseType> {
    return this.http.post<LicenseType>(this.apiUrl, payload); // ✅ renamed to match component
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