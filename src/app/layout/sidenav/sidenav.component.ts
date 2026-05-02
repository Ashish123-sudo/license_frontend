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
  roles?: string[]; // which roles can see this whole group
  children?: NavChild[];
}

export interface NavChild {
  label: string;
  route: string;
  addRoute?: string;
  permission?: string;
  roles?: string[]; // which roles can see this child
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
        {
          label: 'Organizations',
          route: '/organizations',
          addRoute: '/organizations/new',
          roles: ['LMS_ADMIN']               // PRODUCT_ADMIN cannot see this
        },
        {
          label: 'Contacts',
          route: '/contacts',
          addRoute: '/contacts/new',
          roles: ['LMS_ADMIN']               // PRODUCT_ADMIN cannot see this
        },
        {
          label: 'Applications',
          route: '/applications',
          addRoute: '/applications/new'
          // no roles restriction — both can see Applications
        }
      ]
    },
    {
      label: 'Licenses',
      icon: 'verified',
      expanded: false,
      children: [
        {
          label: 'License Types',
          route: '/licenses/types',
          addRoute: '/licenses/types/new'
          // both roles can see
        },
        {
          label: 'Customer Licenses',
          route: '/licenses/assignments',
          addRoute: '/licenses/assignments/new'
          // both roles can see
        }
      ]
    },
    {
      label: 'Settings',
      icon: 'settings',
      expanded: false,
      roles: ['LMS_ADMIN'],                  // entire Settings group hidden from PRODUCT_ADMIN
      children: [
        { label: 'Product Users', route: '/users', addRoute: '/users/new' },
        { label: 'Product Roles', route: '/roles', addRoute: '/roles/new' }
      ]
    }
  ];

  // Filter top-level nav groups by role
  get visibleNavItems(): NavItem[] {
    return this.navItems.filter(item => this.hasGroupAccess(item));
  }

  // Check if the whole group is visible
  hasGroupAccess(item: NavItem): boolean {
    if (!item.roles || item.roles.length === 0) return true;
    const role = this.auth.currentUser()?.roleName;
    return role ? item.roles.includes(role) : false;
  }

  // Check if a child item is visible
  hasAccess(child: NavChild): boolean {
    if (!child.roles || child.roles.length === 0) return true;
    const role = this.auth.currentUser()?.roleName;
    return role ? child.roles.includes(role) : false;
  }

  toggleGroup(item: NavItem) {
    item.expanded = !item.expanded;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth']);
  }
}