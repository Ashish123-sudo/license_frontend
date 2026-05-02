import { Component, Output, EventEmitter, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { SearchService, SearchResult } from '../../core/services/search.service';
import { HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LogoutDialogComponent } from '../../shared/logout-dialog/logout-dialog.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    CommonModule,
    MatDialog
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>();
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const searchWrapper = document.querySelector('.search-wrapper');
    if (searchWrapper && !searchWrapper.contains(target)) {
      this.showDropdown.set(false);
    }
  }

  auth = inject(AuthService);
  private searchService = inject(SearchService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  query = signal('');
  filter = signal('ALL');
  results = signal<SearchResult[]>([]);
  showDropdown = signal(false);

  filters = [
    { value: 'ALL', label: 'All' },
    { value: 'APPLICATION', label: 'Applications' },
    { value: 'LICENSE_TYPE', label: 'License Types' },
    { value: 'ORGANIZATION', label: 'Organizations' },
    { value: 'CONTACT', label: 'Contacts' },
    { value: 'CUSTOMER_LICENSE', label: 'Customer Licenses' },
  ];

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => this.searchService.search(q, this.filter()))
    ).subscribe(results => {
      this.results.set(results);
    });
  }

  get currentFilterLabel(): string {
    return this.filters.find(f => f.value === this.filter())?.label ?? 'All';
  }

  onQueryChange(value: string) {
    this.query.set(value);
    if (value.trim().length < 2) {
      this.results.set([]);
      this.showDropdown.set(false);
      return;
    }
    this.showDropdown.set(true); // always open for valid query
    this.searchSubject.next(value.trim());
  }

  onFilterChange(value: string) {
    this.filter.set(value);
    if (this.query().trim().length >= 2) {
      this.searchSubject.next(this.query().trim());
    }
  }
  closeDropdown() {
    setTimeout(() => this.showDropdown.set(false), 300);
  }

  navigateTo(result: SearchResult) {
    this.showDropdown.set(false);
    this.query.set('');
    this.results.set([]);
    switch (result.type) {
      case 'APPLICATION':
        this.router.navigate(['/applications', result.id]);
        break;
      case 'LICENSE_TYPE':
        this.router.navigate(['/licenses/types', result.id]);
        break;
      case 'ORGANIZATION':
        this.router.navigate(['/organizations', result.id]);
        break;
      case 'CUSTOMER_LICENSE':
        this.router.navigate(['/licenses/customers', result.id]);
        break;
      case 'CONTACT':
        this.router.navigate(['/organizations/contacts', result.id]);
        break;
    }
  }

  get groupedResults() {
    return {
      applications: this.results().filter(r => r.type === 'APPLICATION'),
      licenseTypes: this.results().filter(r => r.type === 'LICENSE_TYPE'),
      organizations: this.results().filter(r => r.type === 'ORGANIZATION'),
      contacts: this.results().filter(r => r.type === 'CONTACT'),
      customerLicenses: this.results().filter(r => r.type === 'CUSTOMER_LICENSE'),
    };
  }

  iconFor(type: string): string {
    const icons: Record<string, string> = {
      APPLICATION: 'apps',
      LICENSE_TYPE: 'card_membership',
      ORGANIZATION: 'business',
      CUSTOMER_LICENSE: 'receipt_long',
    };
    return icons[type] ?? 'search';
  }

  logout() {
    const ref = this.dialog.open(LogoutDialogComponent, {
      width: '380px',
      panelClass: 'logout-dialog-panel'
    });

    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) this.auth.logout();
    });
  }
}