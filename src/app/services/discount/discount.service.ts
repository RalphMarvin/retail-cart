import { Injectable, signal } from '@angular/core';
import { Discount } from '../../models/discount.interface';

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  private currentDiscountSignal = signal<Discount | null>(null);

  readonly currentDiscount = this.currentDiscountSignal.asReadonly();

  // Define all available discounts
  private availableDiscounts: Record<string, Discount> = {
    SAVE10: { type: 'percentage', value: 10 }, // 10% off
    SAVE5: { type: 'fixed', value: 5 }, // $5 off
  };

  validateDiscount(code: string): Discount | null {
    return this.availableDiscounts[code] || null;
  }

  calculateDiscount(subtotal: number, discount: Discount): number {
    if (discount.type === 'percentage') {
      return subtotal * (discount.value / 100); // Calculate percentage discount
    } else if (discount.type === 'fixed') {
      return discount.value; // Fixed amount discount
    }
    return 0;
  }

  setDiscount(discount: Discount): void {
    this.currentDiscountSignal.set(discount);
  }

  clearDiscount(): void {
    this.currentDiscountSignal.set(null);
  }
}
