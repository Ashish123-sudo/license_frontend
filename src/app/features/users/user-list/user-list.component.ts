import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService, User } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private snackbar = inject(MatSnackBar);

  users: User[] = [];
  loading = false;
  displayedColumns: string[] = ['userName', 'role', 'actions'];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.snackbar.open('Failed to load users', 'Close', { duration: 3000 });
        console.error('Error loading users:', err);
      }
    });
  }

  navigateToAdd() {
    this.router.navigate(['/users/new']);
  }

  editUser(id: string | undefined) {
    if (id) this.router.navigate(['/users', id, 'edit']);
  }

  deleteUser(id: string | undefined) {
    if (id && confirm('Are you sure you want to delete this user?')) {
      this.userService.delete(id).subscribe({
        next: () => {
          this.snackbar.open('User deleted', 'Close', { duration: 3000 });
          this.loadUsers();
        },
        error: () => this.snackbar.open('Failed to delete user', 'Close', { duration: 3000 })
      });
    }
  }
}

