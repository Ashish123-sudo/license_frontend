import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangeDetectorRef } from '@angular/core';
import { LicenseTypeService, LicenseType } from '../../../core/services/license-type.service'; // ✅

@Component({
  selector: 'app-license-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './license-list.component.html',
  styleUrl: './license-list.component.scss'
})
export class LicenseListComponent implements OnInit {
  private licenseTypeService = inject(LicenseTypeService); // ✅
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  displayedColumns: string[] = ['application', 'plan', 'limit', 'actions']; // ✅ removed expiry/status — not in LicenseType
  licenseTypes: LicenseType[] = []; // ✅ renamed from licenses
  isLoading = true;

  ngOnInit(): void {
    this.loadLicenseTypes();
  }

  loadLicenseTypes() {
    this.isLoading = true;
    this.licenseTypeService.getLicenseTypes().subscribe({
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