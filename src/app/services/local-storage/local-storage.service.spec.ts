import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';
import { CartItem } from '../../models/cart.interface';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  const CART_KEY = 'cart';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);

    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save cart items to localStorage', () => {
    const cartItems: CartItem[] = [
      {
        product: { id: 1, name: 'Test Product', price: 100, imageUrl: '' },
        quantity: 2,
      },
    ];

    service.save(cartItems);

    const storedData = localStorage.getItem(CART_KEY);
    expect(storedData).not.toBeNull();
    expect(JSON.parse(storedData!)).toEqual(cartItems);
  });

  it('should load cart items from localStorage', () => {
    const cartItems: CartItem[] = [
      {
        product: { id: 1, name: 'Test Product', price: 100, imageUrl: '' },
        quantity: 2,
      },
    ];

    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));

    const loadedCart = service.load();
    expect(loadedCart).toEqual(cartItems);
  });

  it('should return null if there is no saved cart', () => {
    const loadedCart = service.load();
    expect(loadedCart).toBeNull();
  });

  it('should handle invalid JSON in localStorage gracefully', () => {
    localStorage.setItem(CART_KEY, 'invalid-json');

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}); // Suppress console.error

    expect(() => service.load()).not.toThrow();
    expect(service.load()).toBeNull();

    consoleErrorSpy.mockRestore(); // Restore console.error
  });
});
