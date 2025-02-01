import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Product } from '../../models/product.interface';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: CartService;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    price: 50,
    imageUrl: 'https://placehold.co/600x400',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartComponent, ReactiveFormsModule],
      providers: [CartService],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show "Your cart is empty" when there are no items', () => {
    const emptyMessage = fixture.debugElement.query(By.css('p'));
    expect(emptyMessage.nativeElement.textContent).toContain('Your cart is empty');
  });

  it('should display cart items when there are products', () => {
    cartService.addToCart(mockProduct);
    fixture.detectChanges();

    const cartItems = fixture.debugElement.queryAll(By.css('.cart-item'));
    expect(cartItems.length).toBe(1);
    expect(cartItems[0].nativeElement.textContent).toContain('Test Product');
  });

  it('should update quantity when input is changed', () => {
    cartService.addToCart(mockProduct);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('.quantity-input')).nativeElement;
    input.value = '2';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(cartService.items()[0].quantity).toBe(2);
  });

  it('should remove an item when the remove button is clicked', () => {
    cartService.addToCart(mockProduct);
    fixture.detectChanges();

    const removeButton = fixture.debugElement.query(By.css('.btn-danger'));
    removeButton.nativeElement.click();
    fixture.detectChanges();

    expect(cartService.items().length).toBe(0);
  });

  it('should apply a discount when a valid code is entered', () => {
    cartService.addToCart(mockProduct);
    fixture.detectChanges();

    component.discountForm.controls['code'].setValue('SAVE10');
    component.applyDiscount();
    fixture.detectChanges();

    expect(component.discountMessage()).toBe('Discount applied successfully');
    expect(component.discountAmount()).toBe(5); // 10% of $50 = $5
  });

  it('should not apply an invalid discount code', () => {
    component.discountForm.controls['code'].setValue('INVALID');
    component.applyDiscount();
    fixture.detectChanges();

    expect(component.discountMessage()).toBe('Invalid discount code');
    expect(component.discountAmount()).toBe(0);
  });
});
