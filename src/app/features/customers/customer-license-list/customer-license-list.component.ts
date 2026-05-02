import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomerLicenseService, CustomerLicense } from '../../../core/services/customer-license.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-customer-license-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatTableModule,
    MatButtonModule, MatIconModule, MatTooltipModule, MatProgressSpinnerModule
  ],
  templateUrl: './customer-license-list.component.html',
  styleUrl: './customer-license-list.component.scss'
})
export class CustomerLicenseListComponent implements OnInit {
  private licenseService = inject(CustomerLicenseService);
  private authService = inject(AuthService);
  private router = inject(Router);

  displayedColumns: string[] = ['organization', 'application', 'plan', 'count', 'status', 'actions'];
  customerLicenses: CustomerLicense[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadCustomerLicenses();
  }

  loadCustomerLicenses() {
    this.isLoading = true;

    // PRODUCT_ADMIN — fetch only their own customer licenses
    const request$ = this.authService.isProductAdmin()
      ? this.licenseService.getMyLicenses()
      : this.licenseService.getCustomerLicenses();

    request$.subscribe({
      next: (data: CustomerLicense[]) => {
        this.customerLicenses = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to load assignments', err);
        this.isLoading = false;
      }
    });
  }

  editAssignment(id: string) {
    this.router.navigate(['/licenses/assignments', id, 'edit']);
  }
}