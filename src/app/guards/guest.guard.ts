import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Auth } from '../services/auth';

/** Empêche l'accès à login/register lorsque l'utilisateur est déjà connecté. */
export const guestGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return router.createUrlTree(['/mon-compte']);
  }

  return true;
};
