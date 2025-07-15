import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../../shared/models/cart';
import { Product } from '../../shared/models/product';
import { map, debounceTime, switchMap, distinctUntilChanged, tap } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  // Core state signals
  cart = signal<Cart | null>(null);
  private cartUpdateSubject = new Subject<Cart>();

  // Performance optimization: Use Map for O(1) lookups
  private cartItemsMap = signal<Map<number, CartItem>>(new Map());

  // Memoized computed values with optimized calculations
  itemCount = computed(() => {
    const itemsMap = this.cartItemsMap();
    let total = 0;
    for (const item of itemsMap.values()) {
      total += item.quantity;
    }
    return total;
  });

  totalPrice = computed(() => {
    const itemsMap = this.cartItemsMap();

    let subtotal = 0;
    for (const item of itemsMap.values()) {
      subtotal += item.price * item.quantity;
    }

    const deliveryFee = 0;
    const discount = 0;
    return {
      subtotal,
      deliveryFee,
      discount,
      total: subtotal + deliveryFee - discount,
    };
  });

  constructor() {
    // Optimized server sync with request deduplication
    this.cartUpdateSubject
      .pipe(
        debounceTime(250), // Reduced debounce time for better responsiveness
        distinctUntilChanged((prev, curr) => {
          // Only send request if cart actually changed
          return JSON.stringify(prev) === JSON.stringify(curr);
        }),
        switchMap((cart) => {
          console.log('🚀 Syncing cart to server...', {
            itemCount: cart.items.length,
          });
          return this.http.post<Cart>(this.baseUrl + 'cart', cart);
        }),
        tap((result) => {
          console.log('✅ Cart synced successfully', {
            itemCount: result.items.length,
          });
        })
      )
      .subscribe({
        next: (updatedCart) => {
          this.updateCartAndMap(updatedCart);
        },
        error: (error) => {
          console.error('❌ Failed to sync cart:', error);
          // Could implement retry logic or offline queue here
        },
      });

    // Sync cart signal with items map when cart changes
    this.cart.set = ((originalSet) => {
      return (value: Cart | null) => {
        originalSet.call(this.cart, value);
        this.syncCartItemsMap(value);
      };
    })(this.cart.set.bind(this.cart));
  }

  getCart(id: string) {
    return this.http.get<Cart>(this.baseUrl + 'cart?id=' + id).pipe(
      map((cart) => {
        this.updateCartAndMap(cart);
        return cart;
      })
    );
  }

  // Optimized cart operations with minimal object creation
  addItemToCart(item: CartItem | Product, quantity = 1) {
    const cart = this.cart() ?? this.createCart();
    const cartItem = this.isProduct(item)
      ? this.mapProductToCartItem(item)
      : item;

    // Use Map for O(1) operations
    const itemsMap = new Map(this.cartItemsMap());
    const existingItem = itemsMap.get(cartItem.productId);

    if (existingItem) {
      // Update existing item
      itemsMap.set(cartItem.productId, {
        ...existingItem,
        quantity: existingItem.quantity + quantity,
      });
    } else {
      // Add new item
      itemsMap.set(cartItem.productId, { ...cartItem, quantity });
    }

    this.updateCartFromMap(cart.id, itemsMap);
  }

  removeItemFromCart(productId: number, quantity = 1) {
    const cart = this.cart();
    if (!cart) return;

    const itemsMap = new Map(this.cartItemsMap());
    const item = itemsMap.get(productId);
    if (!item) return;

    if (item.quantity <= quantity) {
      itemsMap.delete(productId);
    } else {
      itemsMap.set(productId, {
        ...item,
        quantity: item.quantity - quantity,
      });
    }

    this.updateCartFromMap(cart.id, itemsMap);
  }

  removeEntireItemFromCart(productId: number) {
    const cart = this.cart();
    if (!cart) return;

    const itemsMap = new Map(this.cartItemsMap());
    itemsMap.delete(productId);

    this.updateCartFromMap(cart.id, itemsMap);
  }

  // Batch operations for better performance
  updateCartItems(updates: Array<{ productId: number; quantity: number }>) {
    const cart = this.cart();
    if (!cart) return;

    const itemsMap = new Map(this.cartItemsMap());

    for (const update of updates) {
      const item = itemsMap.get(update.productId);
      if (item) {
        if (update.quantity <= 0) {
          itemsMap.delete(update.productId);
        } else {
          itemsMap.set(update.productId, {
            ...item,
            quantity: update.quantity,
          });
        }
      }
    }

    this.updateCartFromMap(cart.id, itemsMap);
  }

  // Performance helper methods
  private updateCartFromMap(cartId: string, itemsMap: Map<number, CartItem>) {
    const newCart: Cart = {
      id: cartId,
      items: Array.from(itemsMap.values()),
    };

    this.updateCartAndMap(newCart);
    this.cartUpdateSubject.next(newCart);
  }

  private updateCartAndMap(cart: Cart) {
    this.cart.set(cart);
    this.syncCartItemsMap(cart);
  }

  private syncCartItemsMap(cart: Cart | null) {
    if (!cart) {
      this.cartItemsMap.set(new Map());
      return;
    }

    const newMap = new Map<number, CartItem>();
    for (const item of cart.items) {
      newMap.set(item.productId, item);
    }
    this.cartItemsMap.set(newMap);
  }

  private mapProductToCartItem(item: Product): CartItem {
    return {
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.brand,
      type: item.type,
    };
  }

  private isProduct(item: CartItem | Product): item is Product {
    return (item as Product).id !== undefined;
  }

  private createCart(): Cart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }

  // Debug/performance monitoring methods
  getPerformanceStats() {
    const cart = this.cart();
    return {
      itemCount: this.itemCount(),
      totalPrice: this.totalPrice()?.total,
      cartSize: cart?.items.length ?? 0,
      mapSize: this.cartItemsMap().size,
      lastUpdate: new Date().toISOString(),
    };
  }
}
