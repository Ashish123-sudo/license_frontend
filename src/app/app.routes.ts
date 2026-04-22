import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      // --- ORGANIZATIONS ---
      {
        path: 'organizations',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/organizations/org-list/org-list.component').then(m => m.OrgListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/organizations/org-form/org-form.component').then(m => m.OrgFormComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./features/organizations/org-form/org-form.component').then(m => m.OrgFormComponent)
          }
        ]
      },

      // --- APPLICATIONS ---
      {
        path: 'applications',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/applications/app-list/app-list.component').then(m => m.AppListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/applications/app-form/app-form.component').then(m => m.AppFormComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./features/applications/app-form/app-form.component').then(m => m.AppFormComponent)
          }

        ]
      },

      // --- CONTACTS ---
      {
        path: 'contacts',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/contacts/contact-list/contact-list.component').then(m => m.ContactListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/contacts/contact-form/contact-form.component').then(m => m.ContactFormComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./features/contacts/contact-form/contact-form.component').then(m => m.ContactFormComponent)
          }
        ]
      },

      // --- ROLES ---
      {
        path: 'roles',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/roles/role-list/role-list.component').then(m => m.RoleListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/roles/role-form/role-form.component').then(m => m.RoleFormComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./features/roles/role-form/role-form.component').then(m => m.RoleFormComponent)
          }
        ]
      },

      // --- USERS ---
      {
        path: 'users',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/users/user-list/user-list.component').then(m => m.UserListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/users/user-form/user-form.component').then(m => m.UserFormComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./features/users/user-form/user-form.component').then(m => m.UserFormComponent)
          }
        ]
      },

      // --- LICENSE MANAGEMENT ---
      {
        path: 'licenses',
        children: [
          // 1. License Type Routes (Pricing Plan Definitions)
          {
            path: 'types',
            children: [
              {
                path: '',
                loadComponent: () => import('./features/licenses/license-list/license-list.component').then(m => m.LicenseListComponent)
              },
              {
                path: 'new',
                loadComponent: () => import('./features/licenses/license-form/license-form.component').then(m => m.LicenseFormComponent)
              },
              {
                path: ':id/edit',
                loadComponent: () => import('./features/licenses/license-form/license-form.component').then(m => m.LicenseFormComponent)
              }
            ]
          },
          // 2. Customer Assignment Routes (The "Sold" Licenses)
          {
            path: 'assignments',
            children: [
              {
                path: '',
                loadComponent: () => import('./features/customers/customer-license-list/customer-license-list.component').then(m => m.CustomerLicenseListComponent)
              },
              {
                path: 'new',
                loadComponent: () => import('./features/customers/customer-license-form/customer-license-form.component').then(m => m.CustomerLicenseFormComponent)
              },
              {
                path: ':id/edit',
                loadComponent: () => import('./features/customers/customer-license-form/customer-license-form.component').then(m => m.CustomerLicenseFormComponent)
              }
            ]
          },
          // Default to the assignment list if just /licenses is accessed
          { path: '', redirectTo: 'assignments', pathMatch: 'full' }
        ]
      },

      { path: '', redirectTo: 'organizations', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'auth' },
];