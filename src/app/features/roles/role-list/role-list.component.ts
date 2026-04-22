import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RoleService, Role } from '../../../core/services/roles.services';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss'
})
export class RoleListComponent implements OnInit {
  private roleService = inject(RoleService);
  private router = inject(Router);

  roles: Role[] = [];
  // Notice we include 'status' and 'actions' here
  displayedColumns: string[] = ['name', 'description', 'status', 'actions'];

  ngOnInit() {
    this.roleService.getRoles().subscribe(data => {
      this.roles = data;
    });
  }

  navigateToAdd() {
    this.router.navigate(['/roles/new']);
  }

  editRole(id: string | undefined) {
    if (id) {
      this.router.navigate(['/roles', id, 'edit']);
    }
  }
}