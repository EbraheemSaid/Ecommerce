import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { map, take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  // First check if user is already loaded
  if (accountService.currentUser()) {
    router.navigateByUrl('/shop');
    return false;
  }

  // If not loaded, try to get user info first (for cases where init hasn't completed)
  return accountService.getUserInfo().pipe(
    take(1),
    map((user) => {
      if (user) {
        // User is logged in, redirect away from auth pages
        accountService.currentUser.set(user);
        router.navigateByUrl('/shop');
        return false;
      }
      // No user found, allow access to login/register
      return true;
    }),
    catchError(() => {
      // If getUserInfo fails (no cookie/invalid session), allow access
      return of(true);
    })
  );
};
