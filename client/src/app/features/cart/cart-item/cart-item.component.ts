import { Component, input, inject, OnDestroy } from '@angular/core';
import { CartItem } from '../../../shared/models/cart';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [RouterLink, MatButton, MatIcon, CurrencyPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
})
export class CartItemComponent implements OnDestroy {
  item = input.required<CartItem>();
  cartService = inject(CartService);

  private updateTimer: any = null;
  private pendingQuantityChange = 0;

  addToCart() {
    this.debounceQuantityUpdate(1);
  }

  removeFromCart() {
    this.debounceQuantityUpdate(-1);
  }

  deleteItem() {
    // Cancel any pending updates
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
      this.updateTimer = null;
      this.pendingQuantityChange = 0;
    }

    this.cartService.removeEntireItemFromCart(this.item().productId);
  }

  // Optimized: Batch quantity changes to reduce operations
  private debounceQuantityUpdate(quantityChange: number) {
    this.pendingQuantityChange += quantityChange;

    // Clear existing timer
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }

    // Set new timer
    this.updateTimer = setTimeout(() => {
      if (this.pendingQuantityChange > 0) {
        this.cartService.addItemToCart(this.item(), this.pendingQuantityChange);
      } else if (this.pendingQuantityChange < 0) {
        this.cartService.removeItemFromCart(
          this.item().productId,
          Math.abs(this.pendingQuantityChange)
        );
      }

      this.pendingQuantityChange = 0;
      this.updateTimer = null;
    }, 150); // 150ms debounce for responsive feel
  }

  ngOnDestroy() {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
  }
}
