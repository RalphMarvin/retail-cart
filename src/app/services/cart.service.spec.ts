import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../models/product.interface';

describe('CartService', () => {
  let service: CartService;
  let mockProduct: Product;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);

    mockProduct = { id: 1, name: 'Test Product', price: 100, imageUrl: '' };

    // Reset cart to ensure test isolation
    localStorage.clear();
    service['cartItems'].set([]); // Reset signal state manually
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
    service.addToCart(mockProduct); // 100
    const result = service.applyDiscount('SAVE10'); // 10% off
    expect(result.success).toBeTruthy();
    expect(result.discount).toBe(10);
  });

  it('should apply a valid fixed discount code', () => {
    service.addToCart(mockProduct); // 100
    const result = service.applyDiscount('SAVE5'); // $5 off
    expect(result.success).toBeTruthy();
    expect(result.discount).toBe(5);
  });

  it('should return an error for an invalid discount code', () => {
    const result = service.applyDiscount('INVALIDCODE');
    expect(result.success).toBeFalsy();
    expect(result.message).toBe('Invalid discount code');
  });

  it('should save the cart to localStorage', () => {
    service.addToCart(mockProduct);
    expect(localStorage.getItem('cart')).not.toBeNull();
  });

  it('should load cart from localStorage on initialization', () => {
    localStorage.setItem(
      'cart',
      JSON.stringify([{ product: mockProduct, quantity: 2 }])
    );
    const newService = new CartService(); // Simulate new instance creation
    expect(newService.items().length).toBe(1);
    expect(newService.items()[0].quantity).toBe(2);
  });
});
