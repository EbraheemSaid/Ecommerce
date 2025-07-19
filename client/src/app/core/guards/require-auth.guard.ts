import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { map, take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { signal } from '@angular/core';

// Signal to store the return URL
export const returnUrlSignal = signal<string | null>(null);

export const requireAuthGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  // First check if user is already loaded
  if (accountService.currentUser()) {
    return true; // User is authenticated, allow access
  }

  // If not loaded, try to get user info first (for cases where init hasn't completed)
  return accountService.getUserInfo().pipe(
    take(1),
    map((user) => {
      if (user) {
        // User is logged in, allow access
        accountService.currentUser.set(user);
        return true;
      }
      // No user found, store the current URL and redirect to login
      returnUrlSignal.set(state.url);
      router.navigateByUrl('/account/login');
      return false;
    }),
    catchError(() => {
      // If getUserInfo fails (no cookie/invalid session), store URL and redirect to login
      returnUrlSignal.set(state.url);
      router.navigateByUrl('/account/login');
      return of(false);
    })
  );
};
