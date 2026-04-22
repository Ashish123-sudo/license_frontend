import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Added RouterModule for routerLink
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs'; // Added for the Detail Tabs
import { MatDividerModule } from '@angular/material/divider';
import { OrganizationService, Organization } from '../../../core/services/organization.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { ContactService } from '../../../core/services/contact';

@Component({
  selector: 'app-org-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './org-list.component.html',
  styleUrl: './org-list.component.scss',
})
export class OrgListComponent implements OnInit {
  private orgService = inject(OrganizationService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private contactService = inject(ContactService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Reduced columns for the Master view to keep it clean when shrunk
  displayedColumns = ['orgName', 'orgCode', 'email', 'isActive'];
  dataSource = new MatTableDataSource<Organization>([]);
  
  // State Management for Master-Detail
  selectedOrg: Organization | null = null;
  activeTab: 'overview' | 'contacts' = 'overview';
  contacts: any[] = []; // This should ideally come from your service

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  searchTerm = '';
  loading = false;

  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.loadOrgs();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.pageIndex = 0;
      this.loadOrgs();
    });
  }

  loadOrgs() {
    this.loading = true;
    this.orgService.getAll(this.pageIndex, this.pageSize, this.searchTerm).subscribe({
      next: res => {
        this.dataSource.data = res.content;
        this.totalElements = res.totalElements;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.snackbar.open('Failed to load organizations', 'Close', { duration: 3000 });
      }
    });
  }

  loadContacts(orgId: string) {
    this.contactService.getByOrg(orgId).subscribe({
      next: (data) => {
        this.contacts = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.contacts = [];
        this.snackbar.open('Failed to load contacts', 'Close', { duration: 3000 });
      }
    });
  }

  // Master-Detail Methods
  selectOrg(org: Organization) {
    this.selectedOrg = org;
    this.activeTab = 'overview';
    this.loadContacts(org.orgId);
  }


  closeDetail() {
    this.selectedOrg = null;
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadOrgs();
  }

  navigateToCreate() {
    this.router.navigate(['/organizations/new']);
  }

  navigateToEdit(org: Organization) {
    this.router.navigate(['/organizations', org.orgId, 'edit']);
  }

  confirmDelete(org: Organization) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Delete Organization',
        message: `Are you sure you want to delete <strong>${org.orgName}</strong>?`,
        confirmLabel: 'Delete',
        confirmColor: 'warn',
      },
    });

    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteOrg(org);
        if (this.selectedOrg?.orgId === org.orgId) this.closeDetail();
      }
    });
  }

  deleteOrg(org: Organization) {
    this.orgService.delete(org.orgId).subscribe({
      next: () => {
        this.snackbar.open(`${org.orgName} deleted successfully`, 'Close', { duration: 3000 });
        this.selectedOrg = null;
        this.loadOrgs();
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.snackbar.open('Failed to delete organization', 'Close', { duration: 3000 });
      }
    });
  }

  navigateToCreateContact(org: Organization) {
    this.router.navigate(['/contacts/new'], { 
      queryParams: { orgId: org.orgId, orgName: org.orgName } 
    });
  }

  toggleActive(org: Organization) {
    this.orgService.toggleActive(org.orgId).subscribe({
      next: () => {
        const status = !org.isActive ? 'activated' : 'deactivated';
        this.snackbar.open(`${org.orgName} ${status}`, 'Close', { duration: 3000 });
        this.loadOrgs();
        if (this.selectedOrg?.orgId === org.orgId) {
          this.selectedOrg.isActive = !org.isActive;
        }
      },
      error: () => this.snackbar.open('Failed to update status', 'Close', { duration: 3000 })
    });
  }
}