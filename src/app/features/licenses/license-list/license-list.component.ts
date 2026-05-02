import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LicenseTypeService, LicenseType } from '../../../core/services/license-type.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-license-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatTableModule,
    MatButtonModule, MatIconModule, MatTooltipModule
  ],
  templateUrl: './license-list.component.html',
  styleUrl: './license-list.component.scss'
})
export class LicenseListComponent implements OnInit {
  private licenseTypeService = inject(LicenseTypeService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  displayedColumns: string[] = ['application', 'plan', 'limit', 'actions'];
  licenseTypes: LicenseType[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadLicenseTypes();
  }

  loadLicenseTypes() {
    this.isLoading = true;

    // PRODUCT_ADMIN — fetch only their own license types
    const request$ = this.authService.isProductAdmin()
      ? this.licenseTypeService.getMyTypes()
      : this.licenseTypeService.getLicenseTypes();

    request$.subscribe({
      next: (data) => {
        this.licenseTypes = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching license types:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  editLicenseType(id: string) {
    this.router.navigate(['/licenses/types', id, 'edit']);
  }

  deleteLicenseType(id: string) {
    if (confirm('Delete this license type?')) {
      this.licenseTypeService.delete(id).subscribe({
        next: () => this.loadLicenseTypes(),
        error: (err) => console.error('Error deleting:', err)
      });
    }
  }
}