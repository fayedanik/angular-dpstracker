import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isUserLoggedIn = authService.isLoggedIn();
  console.log(isUserLoggedIn);
  if (isUserLoggedIn && route.data['isPublic']) {
    return router.createUrlTree(['/dashboard'], {});
  }
  if (!isUserLoggedIn && state.url !== '/login' && !route.data['isPublic']) {
    return router.createUrlTree(['/login'], {
      queryParams: {
        returnUrl: state.url,
      },
    });
  }
  return true;
};
