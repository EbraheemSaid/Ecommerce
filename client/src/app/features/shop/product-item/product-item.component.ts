import { Component, inject, Input } from '@angular/core';
import { Product } from '../../../shared/models/product';
import { MatCard } from '@angular/material/card';
import { MatCardContent } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { MatCardActions } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    CurrencyPipe,
    MatCardActions,
    MatIcon,
    MatButton,
    RouterLink,
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
})
export class ProductItemComponent {
  @Input() product?: Product;
  cartService = inject(CartService);

  
}
