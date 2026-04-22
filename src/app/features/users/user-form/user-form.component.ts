import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RoleService, Role } from '../../../core/services/roles.services';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatSnackBarModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private roleService = inject(RoleService);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackbar = inject(MatSnackBar);

  roles: Role[] = [];
  isSubmitting = false;
  isEditMode = false;
  userId: string | null = null;

  userForm = this.fb.group({
    userName:        ['', [Validators.required]],
    roleId:          ['', [Validators.required]],
    password:        ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.userId;

    this.roleService.getRoles().subscribe(data => this.roles = data);

    if (this.isEditMode && this.userId) {
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('confirmPassword')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      this.userForm.get('confirmPassword')?.updateValueAndValidity();

      this.userService.getById(this.userId).subscribe({
        next: (user: any) => {
          this.userForm.patchValue({
            userName: user.userName,
            roleId: user.role?.roleId
          });
        },
        error: () => this.snackbar.open('Failed to load user', 'Close', { duration: 3000 })
      });
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { mismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    const { confirmPassword, roleId, ...rest } = this.userForm.getRawValue() as any;

    // Build payload matching backend structure
    const payload: any = {
      ...rest,
      role: { roleId }
    };

    // Remove password if empty in edit mode
    if (this.isEditMode && !payload.password) {
      delete payload.password;
    }

    const request = this.isEditMode && this.userId
      ? this.userService.update(this.userId, payload)
      : this.userService.create(payload);

    request.subscribe({
      next: () => {
        this.snackbar.open('Saved successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/users']);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.snackbar.open(err?.error?.message || 'Error saving', 'Close');
      }
    });
  }

  onCancel() {
    this.router.navigate(['/users']);
  }
}