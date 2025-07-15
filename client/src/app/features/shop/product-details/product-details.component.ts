import { Component, inject, Inject, OnInit } from '@angular/core';
import { Product } from '../../../shared/models/product';
import { ShopService } from '../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatButton,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    MatDivider,
    FormsModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  private shopService = inject(ShopService);
  private activatedRoute = inject(ActivatedRoute);
  cartService = inject(CartService);

  product?: Product;
  quantity: number = 1;

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      console.error('Invalid product ID');
      return;
    }

    this.shopService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
      },
      error: (error) => {
        console.error('Error loading product:', error);
      },
    });
  }

  addToCart() {
    if (!this.product) return;

    // Validate quantity
    if (this.quantity < 1) {
      this.quantity = 1;
      return;
    }

    // Check stock availability
    if (this.quantity > this.product.quantityInStock) {
      console.warn(
        `Only ${this.product.quantityInStock} items available in stock`
      );
      this.quantity = this.product.quantityInStock;
      return;
    }

    // Store quantity before adding to cart
    const quantityToAdd = this.quantity;

    // Add to cart with specified quantity
    this.cartService.addItemToCart(this.product, quantityToAdd);

    // Optional: Reset quantity to 1 after adding
    this.quantity = 1;

    console.log(`Added ${quantityToAdd} x ${this.product.name} to cart`);
  }

  // Quantity validation methods
  onQuantityChange() {
    if (this.quantity < 1) {
      this.quantity = 1;
    }
    if (this.product && this.quantity > this.product.quantityInStock) {
      this.quantity = this.product.quantityInStock;
    }
  }

  incrementQuantity() {
    if (this.product && this.quantity < this.product.quantityInStock) {
      this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
