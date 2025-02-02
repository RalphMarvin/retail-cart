import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../../models/product.interface';
import { DiscountService } from '../discount/discount.service';
import { LocalStorageService } from '../local-storage/local-storage.service';

describe('CartService', () => {
  let service: CartService;
  let discountService: jest.Mocked<DiscountService>;
  let localStorageService: jest.Mocked<LocalStorageService>;
  let mockProduct: Product;

  beforeEach(() => {
    let currentDiscountValue: any = null;

    // Mock DiscountService to track current discount
    discountService = {
      validateDiscount: jest.fn((code: string) => {
        if (code === 'SAVE10') return { type: 'percentage', value: 10 };
        if (code === 'SAVE5') return { type: 'percentage', value: 5 };
        return null;
      }),
      currentDiscount: jest.fn(() => currentDiscountValue),
      setDiscount: jest.fn((discount) => {
        currentDiscountValue = discount;
      }),
      calculateDiscount: jest.fn((subtotal, discount) => {
        if (!discount) return 0;
        if (discount.type === 'percentage') {
          return subtotal * (discount.value / 100);
        }
        return 0;
      }),
    } as unknown as jest.Mocked<DiscountService>;

    // Mock LocalStorageService
    localStorageService = {
      save: jest.fn(),
      load: jest.fn().mockReturnValue(null),
    } as unknown as jest.Mocked<LocalStorageService>;

    TestBed.configureTestingModule({
      providers: [
        { provide: DiscountService, useValue: discountService },
        { provide: LocalStorageService, useValue: localStorageService },
      ],
    });

    service = TestBed.inject(CartService);
    mockProduct = { id: 1, name: 'Test Product', price: 100, imageUrl: '' };

    // Reset cart before each test
    service['cartItems'].set([]);
    currentDiscountValue = null; // Reset discount
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a product to the cart', () => {
    service.addToCart(mockProduct);
    expect(service.items().length).toBe(1);
    expect(service.items()[0].product.id).toBe(mockProduct.id);
    expect(service.items()[0].quantity).toBe(1);
  });

  it('should increase the quantity when adding the same product again', () => {
    service.addToCart(mockProduct);
    service.addToCart(mockProduct);
    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(2);
  });

  it('should remove a product from the cart', () => {
    service.addToCart(mockProduct);
    service.removeFromCart(mockProduct.id);
    expect(service.items().length).toBe(0);
  });

  it('should update the quantity of a product in the cart', () => {
    service.addToCart(mockProduct);
    service.updateQuantity(mockProduct.id, 3);
    expect(service.items()[0].quantity).toBe(3);
  });

  it('should remove a product if the quantity is set to 0', () => {
    service.addToCart(mockProduct);
    service.updateQuantity(mockProduct.id, 0);
    expect(service.items().length).toBe(0);
  });

  it('should calculate the correct subtotal', () => {
    service.addToCart(mockProduct);
    service.addToCart({ ...mockProduct, id: 2, price: 50 });
    expect(service.subtotal()).toBe(150);
  });

  it('should apply a valid percentage discount code', () => {
    service.addToCart(mockProduct); // Subtotal is 100
    const result = service.applyDiscount('SAVE10');

    expect(result.success).toBeTruthy();
    expect(result.discount).toBe(10);
    expect(discountService.setDiscount).toHaveBeenCalledWith({ type: 'percentage', value: 10 });
    expect(discountService.calculateDiscount).toHaveBeenCalledWith(100, { type: 'percentage', value: 10 });
  });

  it('should return an error for an invalid discount code', () => {
    discountService.validateDiscount.mockReturnValue(null);

    const result = service.applyDiscount('INVALIDCODE');
    expect(result.success).toBeFalsy();
    expect(result.message).toBe('Invalid discount code');
  });

  it('should save the cart to localStorage', fakeAsync(() => {
    service.addToCart(mockProduct);
    tick();
    expect(localStorageService.save).toHaveBeenCalledWith([{ product: mockProduct, quantity: 1 }]);
  }));
});
