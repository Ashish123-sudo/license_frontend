import { Component, EventEmitter, Output, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  isDirect?: boolean;
  expanded?: boolean;
  children?: { label: string; route: string; addRoute?: string; permission?: string }[];
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatExpansionModule,
    MatListModule,
    MatButtonModule
  ]
})
export class SidenavComponent {
  private router = inject(Router);
  auth = inject(AuthService);

  @Input() sidebarOpen: boolean = true;
  @Output() closeSidenav = new EventEmitter<void>();

  navItems: NavItem[] = [
  {
    label: 'CRM',
    icon: 'apartment',
    expanded: true,
    children: [
      { label: 'Organizations', route: '/organizations', addRoute: '/organizations/new' },
      { label: 'Contacts',      route: '/contacts',      addRoute: '/contacts/new' },
      { label: 'Applications',  route: '/applications',  addRoute: '/applications/new' }
    ]
  },
  {
    label: 'Licenses',
    icon: 'verified',
    expanded: false,
    children: [
      { label: 'License Types',     route: '/licenses/types',       addRoute: '/licenses/types/new' },
      { label: 'Customer Licenses', route: '/licenses/assignments', addRoute: '/licenses/assignments/new' }
    ]
  },
  {
    label: 'Settings',
    icon: 'settings',
    expanded: false,
    children: [
      { label: 'Product Users', route: '/users', addRoute: '/users/new' },
      { label: 'Product Roles', route: '/roles', addRoute: '/roles/new' }
    ]
  }
];

  toggleGroup(item: NavItem) {
    item.expanded = !item.expanded;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  hasAccess(item: any): boolean {
    if (!item.permission) return true;
    return this.auth.hasPermission(item.permission);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}