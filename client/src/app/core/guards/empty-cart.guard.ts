import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { map } from 'rxjs/operators';
import { computed } from '@angular/core';

export const emptyCartGuard: CanActivateFn = (route, state) => {
  const cartService = inject(CartService);
  const router = inject(Router);

  // Check if cart is empty using the itemCount computed signal
  const itemCount = cartService.itemCount();

  if (itemCount === 0) {
    // Cart is empty, redirect to cart page
    router.navigateByUrl('/cart');
    return false;
  }

  // Cart has items, allow access to checkout
  return true;
};
