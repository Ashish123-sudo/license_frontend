import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RoleService } from '../../../core/services/roles.services';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.scss'
})
export class RoleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private roleService = inject(RoleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackbar = inject(MatSnackBar);

  isEditMode = false;
  roleId: string | null = null;
  isSubmitting = false;

  // This must be inside the class
  roleForm = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    isActive: [true]
  });

  ngOnInit() {
    this.roleId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.roleId;

    if (this.isEditMode && this.roleId) {
      this.roleService.getById(this.roleId).subscribe(role => {
        this.roleForm.patchValue({
          name: role.name,
          description: role.description,
          isActive: role.isActive
        });
      });
    }
  }

  onSubmit() {
    if (this.roleForm.invalid) return;
    this.isSubmitting = true;
    
    const payload = this.roleForm.getRawValue() as any;

    const request = this.isEditMode && this.roleId
      ? this.roleService.update(this.roleId, payload)
      : this.roleService.create(payload);

    request.subscribe({
      next: () => {
        this.snackbar.open('Role saved successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/roles']);
      },
      error: () => {
        this.isSubmitting = false;
        this.snackbar.open('Error saving role', 'Close', { duration: 3000 });
      }
    });
  }

  onCancel() {
    this.router.navigate(['/roles']);
  }
}