import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrganizationService } from '../../../core/services/organization.service';

@Component({
  selector: 'app-org-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './org-form.component.html',
  styleUrl: './org-form.component.scss',
})
export class OrgFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private orgService = inject(OrganizationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackbar = inject(MatSnackBar);

  isEditMode = false;
  orgId: string | null = null;
  isSubmitting = false;

  orgForm = this.fb.group({
    orgName:    ['', [Validators.required]],
    industry:   [''],
    phone:      [''],
    email:      ['', [Validators.email]],
    website:    [''],
    address1:   [''],
    address2:   [''],
    city:       [''],
    state:      [''],
    country:    [''],
    postalCode: [''],
    notes:      [''],
    isActive:   [true]
  });

  // separate control for display only in edit mode
  orgCodeDisplay = '';

  ngOnInit() {
    this.orgId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.orgId;

    if (this.isEditMode && this.orgId) {
      this.orgService.getById(this.orgId).subscribe({
        next: (org) => {
          this.orgCodeDisplay = org.orgCode;
          this.orgForm.patchValue(org);
        },
        error: () => this.snackbar.open('Failed to load data', 'Close', { duration: 3000 })
      });
    }
  }

  onSubmit() {
    if (this.orgForm.invalid) {
      this.orgForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload = this.orgForm.getRawValue() as any;

    // Include orgCode in update payload
    if (this.isEditMode) {
      payload.orgCode = this.orgCodeDisplay;
    }

    const request = this.isEditMode && this.orgId
      ? this.orgService.update(this.orgId, payload)
      : this.orgService.create(payload);

    request.subscribe({
      next: () => {
        this.snackbar.open('Saved successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/organizations']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.snackbar.open(err?.error?.message || 'Error saving', 'Close');
      }
    });
  }

  onCancel() {
    this.router.navigate(['/organizations']);
  }
}