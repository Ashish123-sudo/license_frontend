import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; // ✅
import { CustomerLicenseService, CreateCustomerLicensePayload } from '../../../core/services/customer-license.service';
import { ApplicationService } from '../../../core/services/application.service';
import { OrganizationService } from '../../../core/services/organization.service';
import { LicenseTypeService } from '../../../core/services/license-type.service';
import { forkJoin } from 'rxjs'; // ✅

@Component({
  selector: 'app-customer-license-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-license-form.component.html',
  styleUrl: './customer-license-form.component.scss'
})
export class CustomerLicenseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // ✅
  private appService = inject(ApplicationService);
  private orgService = inject(OrganizationService);
  private typeService = inject(LicenseTypeService);
  private licenseService = inject(CustomerLicenseService);

  customerForm!: FormGroup;
  organizations: any[] = [];
  applications: any[] = [];
  allLicenseTypes: any[] = [];
  filteredTypes: any[] = [];
  isEditMode = false;           // ✅
  licenseId: string | null = null; // ✅

  ngOnInit() {
    this.licenseId = this.route.snapshot.paramMap.get('id'); // ✅
    this.isEditMode = !!this.licenseId;

    this.initForm();
    this.loadData();
  }

  private initForm() {
    this.customerForm = this.fb.group({
      appId:         ['', Validators.required],
      orgId:         ['', Validators.required],
      licenseTypeId: ['', Validators.required],
      licenseCount:  [1, [Validators.required, Validators.min(1)]],
      isActive:      [true]
    });
  }

  private loadData() {
    // ✅ Load all dropdowns in parallel
    forkJoin({
      orgs: this.orgService.getOrganizations(),
      apps: this.appService.getApplications(),
      types: this.typeService.getLicenseTypes()
    }).subscribe(({ orgs, apps, types }) => {
      this.organizations = orgs;
      this.applications = apps;
      this.allLicenseTypes = types;

      // ✅ If edit mode, load existing record and patch form
      if (this.isEditMode && this.licenseId) {
        this.licenseService.getById(this.licenseId).subscribe({
          next: (cl) => {
            const appId = cl.application?.appId;
            this.customerForm.patchValue({
              appId,
              orgId:         cl.organization?.orgId,
              licenseTypeId: cl.licenseType?.licenseTypeId,
              licenseCount:  cl.licenseCount,
              isActive:      cl.isActive
            });
            // ✅ Filter license types for the pre-selected app
            this.filteredTypes = this.allLicenseTypes.filter(
              t => t.application?.appId === appId
            );
          },
          error: (err) => console.error('Error loading assignment:', err)
        });
      }
    });
  }

  onAppChange() {
    const selectedAppId = this.customerForm.get('appId')?.value;
    this.filteredTypes = this.allLicenseTypes.filter(
      t => t.application?.appId === selectedAppId
    );
    this.customerForm.get('licenseTypeId')?.setValue('');
  }

  onCancel() {
    this.router.navigate(['/licenses/assignments']);
  }

  onSubmit() {
    if (this.customerForm.invalid) return;

    const { appId, orgId, licenseTypeId, licenseCount, isActive } = this.customerForm.getRawValue();
    const payload: CreateCustomerLicensePayload = {
      application:  { appId },
      organization: { orgId },
      licenseType:  { licenseTypeId },
      licenseCount,
      isActive
    };

    if (this.isEditMode && this.licenseId) {
      // ✅ Update
     this.licenseService.update(this.licenseId, payload).subscribe({
        next: () => this.router.navigate(['/licenses/assignments']),
        error: (err: any) => console.error('Error updating:', err)
      });
    } else {
      // ✅ Create
      this.licenseService.createCustomerLicense(payload).subscribe({
        next: () => this.router.navigate(['/licenses/assignments']),
        error: (err: any) => console.error('Error creating:', err)
      });
    }
  }
}