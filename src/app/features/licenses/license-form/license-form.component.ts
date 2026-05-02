import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ApplicationService } from '../../../core/services/application.service';
import { LicenseTypeService, CreateLicenseTypePayload } from '../../../core/services/license-type.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-license-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './license-form.component.html',
  styleUrl: './license-form.component.scss'
})
export class LicenseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private appService = inject(ApplicationService);
  private licenseTypeService = inject(LicenseTypeService);
  private authService = inject(AuthService); // ← add

  licenseForm!: FormGroup;
  applications: any[] = [];
  isEditMode = false;
  licenseTypeId: string | null = null;

  ngOnInit() {
    this.licenseTypeId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.licenseTypeId;

    this.licenseForm = this.fb.group({
      appId:          ['', Validators.required],
      pricingPlan:    ['', Validators.required],
      pricingLimit:   [0, [Validators.required, Validators.min(1)]],
      limitUom:       ['Users', Validators.required],
      limitFrequency: [30, Validators.required]
    });

    // ← use role-based app fetch
    const apps$ = this.authService.isProductAdmin()
      ? this.appService.getMyApps()
      : this.appService.getApplications();

    apps$.subscribe(data => {
      this.applications = data;

      if (this.isEditMode && this.licenseTypeId) {
        this.licenseTypeService.getById(this.licenseTypeId).subscribe({
          next: (lt) => {
            this.licenseForm.patchValue({
              appId:          lt.application?.appId,
              pricingPlan:    lt.pricingPlan,
              pricingLimit:   lt.pricingLimit,
              limitUom:       lt.limitUom,
              limitFrequency: lt.limitFrequency
            });
          },
          error: (err) => console.error('Error loading license type:', err)
        });
      }
    });
  }

  onSubmit() {
    if (this.licenseForm.invalid) return;

    const { appId, pricingPlan, pricingLimit, limitUom, limitFrequency } = this.licenseForm.getRawValue();
    const payload: CreateLicenseTypePayload = {
      application: { appId },
      pricingPlan,
      pricingLimit: Number(pricingLimit),
      limitUom,
      limitFrequency: Number(limitFrequency)
    };

    if (this.isEditMode && this.licenseTypeId) {
      this.licenseTypeService.update(this.licenseTypeId, payload).subscribe({
        next: () => this.router.navigate(['/licenses/types']),
        error: (err) => console.error('Error updating license type:', err)
      });
    } else {
      this.licenseTypeService.saveLicenseType(payload).subscribe({
        next: () => this.router.navigate(['/licenses/types']),
        error: (err) => console.error('Error saving license type:', err)
      });
    }
  }

  onCancel() {
    this.router.navigate(['/licenses/types']);
  }
}