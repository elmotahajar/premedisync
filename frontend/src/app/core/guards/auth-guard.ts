import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthService);

  if (isPlatformBrowser(platformId)) {
    const token = authService.getToken();
    const role = authService.getRole();

    if (!token) {
      return router.createUrlTree(['/login']);
    }

    const url = route.routeConfig?.path || '';
    if (url.startsWith('secretaire') && role !== 'secretaire') {
      return router.createUrlTree([role === 'medecin' ? '/medecin/dashboard' : role === 'admin' ? '/admin/dashboard' : '/patient/dashboard']);
    }
    if (url.startsWith('medecin') && role !== 'medecin') {
      return router.createUrlTree([role === 'secretaire' ? '/secretaire/dashboard' : role === 'admin' ? '/admin/dashboard' : '/patient/dashboard']);
    }
    if (url.startsWith('admin') && role !== 'admin') {
      return router.createUrlTree([role === 'medecin' ? '/medecin/dashboard' : role === 'secretaire' ? '/secretaire/dashboard' : '/patient/dashboard']);
    }
    return true;
  }
  return router.createUrlTree(['/login']);
};