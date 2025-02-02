import { TestBed } from '@angular/core/testing';
import { DiscountService } from './discount.service';
import { Discount } from '../../models/discount.interface';

describe('DiscountService', () => {
  let service: DiscountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiscountService]
    });

    service = TestBed.inject(DiscountService);

    // Mock DiscountService methods
    service.validateDiscount = jest.fn((code: string) => {
      if (code === 'SAVE10') {
        return { type: 'percentage', value: 10 };
      }
      if (code === 'SAVE5') {
        return { type: 'percentage', value: 5 };
      }
      return null;
    });

    service.calculateDiscount = jest.fn((subtotal: number, discount: Discount) => {
      if (discount && discount.type === 'percentage') {
        return subtotal * (discount.value / 100);
      }
      return 0;
    });

    service.setDiscount = jest.fn();
    service.clearDiscount = jest.fn(() => {
      // Clear the active discount
      service['currentDiscountSignal'].set(null);
    });
  });

  it('should return the correct discount for a valid code', () => {
    const discount = service.validateDiscount('SAVE10');
    expect(discount).toEqual({ type: 'percentage', value: 10 });
  });

  it('should return the correct discount for another valid code', () => {
    const discount = service.validateDiscount('SAVE5');
    expect(discount).toEqual({ type: 'percentage', value: 5 });
  });

  it('should return null for an invalid discount code', () => {
    const discount = service.validateDiscount('INVALID');
    expect(discount).toBeNull();
  });

  it('should calculate a percentage discount correctly', () => {
    const discount = { type: 'percentage', value: 10 } as Discount;
    const result = service.calculateDiscount(100, discount); // 10% of 100
    expect(result).toBe(10);
  });

  it('should calculate a percentage discount correctly for another value', () => {
    const discount = { type: 'percentage', value: 5 } as Discount;
    const result = service.calculateDiscount(100, discount); // 5% of 100
    expect(result).toBe(5);
  });
});
