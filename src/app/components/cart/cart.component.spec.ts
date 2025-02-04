import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart/cart.service';
import { DiscountService } from '../../services/discount/discount.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Product } from '../../models/product.interface';
import { signal, computed } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { CartItem } from '../../models/cart.interface';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    price: 50,
    imageUrl: 'https://placehold.co/600x400',
  };

  type MockCartService = {
    items: ReturnType<typeof signal<CartItem[]>>;
    subtotal: ReturnType<typeof computed>;
    total: ReturnType<typeof computed>;
    appliedDiscount: ReturnType<typeof signal<number>>;
    addToCart: jest.Mock;
    removeFromCart: jest.Mock;
    updateQuantity: jest.Mock;
    applyDiscount: jest.Mock;
  };

  let itemsSignal: ReturnType<typeof signal<CartItem[]>>;
  let appliedDiscountSignal: ReturnType<typeof signal<number>>;

  let mockCartService: MockCartService;
  let mockLocalStorageService: any;
  let mockDiscountService: any;

  beforeEach(async () => {
    itemsSignal = signal<CartItem[]>([]);
    appliedDiscountSignal = signal<number>(0);

    mockCartService = {
      items: itemsSignal,
      subtotal: computed(() => {
        return itemsSignal().reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      }),
      total: computed(() => {
        return (
          itemsSignal().reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
          ) - appliedDiscountSignal()
        );
      }),
      appliedDiscount: appliedDiscountSignal,
      addToCart: jest.fn((product: Product) => {
        itemsSignal.update((items) => [...items, { product, quantity: 1 }]);
      }),
      removeFromCart: jest.fn((productId: number) => {
        itemsSignal.update((items) =>
          items.filter((item) => item.product.id !== productId)
        );
      }),
      updateQuantity: jest.fn((productId: number, quantity: number) => {
        itemsSignal.update((items) =>
          items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        );
      }),
      applyDiscount: jest.fn(),
    };

    mockLocalStorageService = { save: jest.fn(), load: jest.fn() };
    mockDiscountService = {
      validateDiscount: jest.fn(),
      calculateDiscount: jest.fn(),
      clearDiscount: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CartComponent, ReactiveFormsModule, NgOptimizedImage],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: DiscountService, useValue: mockDiscountService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;

    // Reset signals before each test
    mockCartService.items.set([]);
    mockCartService.appliedDiscount.set(0);
    jest.clearAllMocks();

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Your cart is empty" when no items exist', () => {
    const emptyMessage = fixture.debugElement.query(By.css('p'));
    expect(emptyMessage.nativeElement.textContent).toContain(
      'Your cart is empty'
    );
  });

  it('should display cart items when products are added', () => {
    mockCartService.addToCart(mockProduct);
    fixture.detectChanges();

    const cartItems = fixture.debugElement.queryAll(By.css('.cart-item'));
    expect(cartItems.length).toBe(1);
    expect(cartItems[0].nativeElement.textContent).toContain('Test Product');
  });

  it('should update quantity when input is changed', () => {
    mockCartService.addToCart(mockProduct);
    fixture.detectChanges();

    const input = fixture.debugElement.query(
      By.css('.quantity-input')
    ).nativeElement;
    input.value = '2';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(mockCartService.updateQuantity).toHaveBeenCalledWith(
      mockProduct.id,
      2
    );
  });

  it('should remove an item when the remove button is clicked', () => {
    mockCartService.addToCart(mockProduct);
    fixture.detectChanges();

    const removeButton = fixture.debugElement.query(By.css('.btn-danger'));
    removeButton.nativeElement.click();
    fixture.detectChanges();

    expect(mockCartService.removeFromCart).toHaveBeenCalledWith(mockProduct.id);
    expect(mockCartService.items().length).toBe(0);
  });

  it('should apply a valid discount code', () => {
    // Mock a successful discount application
    mockCartService.applyDiscount.mockReturnValue({
      success: true,
      message: 'Discount applied successfully',
      discount: 5,
    });

    component.discountForm.controls['code'].setValue('SAVE10');
    component.applyDiscount();
    fixture.detectChanges();

    expect(component.discountCodeApplied()).toBe('SAVE10');
    expect(mockCartService.applyDiscount).toHaveBeenCalledWith('SAVE10');
  });

  it('should not apply an invalid discount code', () => {
    // Force applyDiscount to return an error
    mockCartService.applyDiscount.mockReturnValue({
      success: false,
      message: 'Invalid discount code',
      discount: 0,
    });

    component.discountForm.controls['code'].setValue('INVALID');
    component.applyDiscount();
    fixture.detectChanges();

    expect(component.discountMessage()).toBe('');
    expect(component.discountApplied()).toBe(false);
    expect(component.discountCodeApplied()).toBe('');
    expect(mockCartService.applyDiscount).toHaveBeenCalledWith('INVALID');
  });

  it('should display error toast when an invalid discount code is applied', fakeAsync(() => {
    // Force applyDiscount to return an error
    mockCartService.applyDiscount.mockReturnValue({
      success: false,
      message: 'Invalid discount code',
      discount: 0,
    });

    // Set an invalid discount code
    component.discountForm.controls['code'].setValue('INVALID');
    component.applyDiscount();
    fixture.detectChanges();

    // Check error message
    expect(component.errorMessage).toBe('Invalid discount code');

    // Advance time to trigger timeout
    tick(5000);
    fixture.detectChanges();

    // Check error message is cleared
    expect(component.errorMessage).toBe('');
  }));

  it('should calculate correct subtotal and total with discount', () => {
    mockCartService.addToCart(mockProduct);
    mockCartService.appliedDiscount.set(5);
    fixture.detectChanges();

    expect(mockCartService.subtotal()).toBe(50);
    expect(mockCartService.total()).toBe(45);
  });

  it('should reset discount form after successful application', () => {
    mockCartService.applyDiscount.mockReturnValue({
      success: true,
      message: 'Discount applied successfully',
      discount: 5,
    });

    component.discountForm.controls['code'].setValue('SAVE10');
    component.applyDiscount();
    fixture.detectChanges();

    expect(component.discountForm.get('code')?.value).toBeFalsy();
  });
});
