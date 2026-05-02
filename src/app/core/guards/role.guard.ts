import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const role = auth.currentUser()?.roleName;

    if (role && allowedRoles.includes(role)) {
      return true;
    }

    router.navigate(['/applications']); // safe fallback for PRODUCT_ADMIN
    return false;
  };
}