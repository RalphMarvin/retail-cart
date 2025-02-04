import { CartItem } from '../../models/cart.interface';
import { DiscountResult } from '../../models/discount.interface';
import { Product } from '../../models/product.interface';
import { computed, effect, Injectable, signal } from '@angular/core';
import { DiscountService } from '../discount/discount.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { CartState } from '../../states/cart.state';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  readonly items = this.cartItems.asReadonly();

  readonly totalItems = computed(() => {
    const uniqueProductIds = new Set(
      this.items().map((item) => item.product.id)
    );
    return uniqueProductIds.size;
  });

  readonly subtotal = computed(() =>
    this.items().reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  );

  readonly appliedDiscount = computed(() => {
    const discount = this.discountService.currentDiscount();
    return discount
      ? this.discountService.calculateDiscount(this.subtotal(), discount)
      : 0;
  });

  readonly total = computed(() => this.subtotal() - this.appliedDiscount());

  // Complete cart state as a single computed value
  readonly cartState = computed<CartState>(() => ({
    items: this.items(),
    totalItems: this.totalItems(),
    subtotal: this.subtotal(),
    discount: this.appliedDiscount(),
    total: this.total(),
  }));

  constructor(
    private storage: LocalStorageService,
    private discountService: DiscountService
  ) {
    this.initializeCart();
    effect(() => {
      // Automatically save cart whenever items change
      this.storage.save(this.items());
    });
  }

  private initializeCart(): void {
    const savedCart = this.storage.load();
    if (savedCart) {
      this.cartItems.set(savedCart);
    }
  }

  addToCart(product: Product): void {
    this.cartItems.update((items) => {
      const existingItem = items.find((item) => item.product.id === product.id);

      if (existingItem) {
        return items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...items, { product, quantity: 1 }];
    });
  }

  removeFromCart(productId: number): void {
    this.cartItems.update((items) =>
      items.filter((item) => item.product.id !== productId)
    );
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartItems.update((items) =>
      items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }

  applyDiscount(code: string): DiscountResult {
    const discount = this.discountService.validateDiscount(code);

    if (!discount) {
      return { success: false, message: 'Invalid discount code' };
    }

    this.discountService.setDiscount(discount);

    return {
      success: true,
      message: 'Discount applied successfully',
      discount: this.appliedDiscount(),
    };
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.discountService.clearDiscount();
  }
}
