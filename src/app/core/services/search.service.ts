import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SearchResult {
  type: 'APPLICATION' | 'LICENSE_TYPE' | 'ORGANIZATION' | 'CONTACT' | 'CUSTOMER_LICENSE';
  id: string;
  title: string;
  subtitle: string;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private http = inject(HttpClient);

  search(query: string, filter: string = 'ALL'): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>('http://localhost:8080/api/search', {
      params: { query, filter }
    });
  }
}