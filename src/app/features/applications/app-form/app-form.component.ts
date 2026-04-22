import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService, User } from '../../../core/services/user.service';
import { ApplicationService, Application, CreateApplicationPayload } from '../../../core/services/application.service';

@Component({
  selector: 'app-app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './app-form.component.html',
  styleUrl: './app-form.component.scss'
})
export class AppFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private appService = inject(ApplicationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackbar = inject(MatSnackBar);

  users: User[] = [];
  isSubmitting = false;
  isEditMode = false;
  appId: string | null = null;

  appForm = this.fb.group({
    appName:   ['', [Validators.required]],
    userId:    ['', [Validators.required]],
    isActive:  [true]
  });

  ngOnInit() {
    this.appId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.appId;

    this.userService.getUsers().subscribe((data: User[]) => {
      this.users = data;
    });

    if (this.isEditMode && this.appId) {
      this.appService.getById(this.appId).subscribe({
        next: (app: Application) => {
          this.appForm.patchValue({
            appName:  app.appName,
            userId:   app.productOwner?.userId,
            isActive: app.isActive
          });
        },
        error: () => this.snackbar.open('Failed to load application', 'Close', { duration: 3000 })
      });
    }
  }

  onSubmit() {
    if (this.appForm.invalid) {
      this.appForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;

    const { appName, userId, isActive } = this.appForm.getRawValue();
    const payload: CreateApplicationPayload = {
      appName:      appName!,
      productOwner: { userId: userId! },
      isActive:     isActive!
    };

    const request = this.isEditMode && this.appId
      ? this.appService.update(this.appId, payload)
      : this.appService.create(payload);

    request.subscribe({
      next: () => {
        this.snackbar.open('Saved successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/applications']);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.snackbar.open(err?.error?.message || 'Error saving', 'Close');
      }
    });
  }

  onCancel() {
    this.router.navigate(['/applications']);
  }
}