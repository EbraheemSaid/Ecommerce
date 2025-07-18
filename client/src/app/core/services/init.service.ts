import { inject, Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { AccountService } from './account.service';
import { of, forkJoin } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private cartService = inject(CartService);
  private accountService = inject(AccountService);

  init() {
    const cartId = localStorage.getItem('cart_id');
    const cart$ = cartId ? this.cartService.getCart(cartId) : of(null);

    // Check for existing user session
    const userInfo$ = this.accountService.getUserInfo().pipe(
      tap((user) => this.accountService.currentUser.set(user)),
      catchError(() => of(null)) // If getUserInfo fails, just continue
    );

    return forkJoin([cart$, userInfo$]);
  }
}
