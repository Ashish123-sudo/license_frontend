import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApplicationService, Application } from '../../../core/services/application.service';

@Component({
  selector: 'app-app-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatTableModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  templateUrl: './app-list.component.html',
  styleUrl: './app-list.component.scss'
})
export class AppListComponent implements OnInit {
  private appService = inject(ApplicationService);
  private router = inject(Router);
  private snackbar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  applications: Application[] = [];
  loading = false;
  displayedColumns: string[] = ['appName', 'owner', 'status', 'actions'];
  openMenuId: string | null = null;

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.loading = true;
    this.appService.getApplications().subscribe({
      next: (data: Application[]) => {
        this.applications = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.snackbar.open('Failed to load applications', 'Close', { duration: 3000 });
      }
    });
  }

  navigateToAdd() {
    this.router.navigate(['/applications/new']);
  }

  editApp(id: string | undefined) {
    if (id) this.router.navigate(['/applications', id, 'edit']);
  }

  toggleMenu(id: string | undefined, event: MouseEvent) {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === id ? null : (id ?? null);
  }

  deleteApp(app: Application) {
    if (confirm(`Delete "${app.appName}"?`)) {
      this.appService.delete(app.appId!).subscribe({
        next: () => {
          this.snackbar.open(`"${app.appName}" deleted successfully`, 'Close', { duration: 3000 });
          this.loadApplications();
        },
        error: (err) => {
          const backendMsg = err?.error?.message;
          if (err.status === 409) {
            this.snackbar.open(
              backendMsg || `Cannot delete "${app.appName}" — it is linked to existing License Types or Customer Licenses.`,
              'Close',
              { duration: 6000 }
            );
          } else {
            this.snackbar.open('Failed to delete application.', 'Close', { duration: 3000 });
          }
        }
      });
    }
  }
}