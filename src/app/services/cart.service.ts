import { CartItem } from '../models/cart.interface';
import { Product } from '../models/product.interface';
import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  private validDiscounts = new Map([
    ['SAVE10', { type: 'percentage', value: 10 }],
    ['SAVE5', { type: 'fixed', value: 5 }]
  ]);

  readonly items = this.cartItems.asReadonly();

  readonly totalItems = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.items().reduce((total, item) =>
      total + (item.product.price * item.quantity), 0)
  );

  constructor() {
    // Load cart from localStorage if exists
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.set(JSON.parse(savedCart));
    }
  }

  addToCart(product: Product): void {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      this.cartItems.update(items =>
        items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      this.cartItems.update(items => [...items, { product, quantity: 1 }]);
    }

    this.updateStorage();
  }

  removeFromCart(productId: number): void {
    this.cartItems.update(items =>
      items.filter(item => item.product.id !== productId)
    );
    this.updateStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.cartItems.update(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
    this.updateStorage();
  }

  applyDiscount(code: string): { success: boolean; message: string; discount?: number } {
    const discount = this.validDiscounts.get(code);

    if (!discount) {
      return { success: false, message: 'Invalid discount code' };
    }

    const subtotalValue = this.subtotal();
    let discountAmount = 0;

    if (discount.type === 'percentage') {
      discountAmount = (subtotalValue * discount.value) / 100;
    } else {
      discountAmount = discount.value;
    }

    return {
      success: true,
      message: 'Discount applied successfully',
      discount: discountAmount
    };
  }

  private updateStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems()));
  }
}
