import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CartItemComponent } from './cart-item/cart-item.component';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CartItemComponent,
    OrderSummaryComponent,
    MatIcon,
    MatButton,
    RouterLink,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cartService = inject(CartService);

  clearCart() {
    const cart = this.cartService.cart();
    if (!cart || cart.items.length === 0) return;

    // Clear all items by removing each one
    const itemsToRemove = [...cart.items];
    itemsToRemove.forEach((item) => {
      this.cartService.removeEntireItemFromCart(item.productId);
    });
  }

  // Performance debugging method (remove in production)
  logPerformanceStats() {
    if (typeof window !== 'undefined' && (window as any).console) {
      console.table(this.cartService.getPerformanceStats());
    }
  }

  // You can call this method from browser dev tools:
  // angular.getComponent($0).logPerformanceStats()
}
