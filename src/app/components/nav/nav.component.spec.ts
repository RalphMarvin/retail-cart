import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavComponent } from './nav.component';
import { CartService } from '../../services/cart.service';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ProductListComponent } from '../product-list/product-list.component';
import { CartComponent } from '../cart/cart.component';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let cartService: CartService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavComponent],
      providers: [
        CartService,
        provideRouter([
          { path: 'products', component: ProductListComponent },
          { path: 'cart', component: CartComponent },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home when brand link is clicked', () => {
    jest.spyOn(router, 'navigate'); // Use jest.spyOn instead of spyOn()
    const homeLink = fixture.debugElement.query(
      By.css('.nav-brand')
    ).nativeElement;
    homeLink.click();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to products when products link is clicked', () => {
    jest.spyOn(router, 'navigate');
    const productsLink = fixture.debugElement.query(
      By.css('.nav-link[routerLink="/products"]')
    ).nativeElement;
    productsLink.click();
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should navigate to cart when cart link is clicked', () => {
    jest.spyOn(router, 'navigate');
    const cartLink = fixture.debugElement.query(
      By.css('.nav-link[routerLink="/cart"]')
    ).nativeElement;
    cartLink.click();
    expect(router.navigate).toHaveBeenCalledWith(['/cart']);
  });

  it('should display cart item count when items are in cart', () => {
    cartService.addToCart({
      id: 1,
      name: 'Test Product',
      price: 50,
      imageUrl: '',
    });
    fixture.detectChanges();

    const badge = fixture.debugElement.query(By.css('.badge'));
    expect(badge.nativeElement.textContent.trim()).toBe('1'); // trim whitespace
  });

  it('should not display the cart badge when there are no items in cart', () => {
    // Ensure the cart is empty
    cartService.removeFromCart(1); // Remove any items that may have been added
    fixture.detectChanges(); // Trigger change detection

    const badge = fixture.debugElement.query(By.css('.badge'));
    expect(badge).toBeNull(); // badge should not be in the DOM at all
  });
});
