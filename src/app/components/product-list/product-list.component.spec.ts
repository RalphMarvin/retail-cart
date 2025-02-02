import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { CartService } from '../../services/cart/cart.service';
import { By } from '@angular/platform-browser';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [CartService],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService); // Inject the CartService

    fixture.detectChanges(); // Trigger change detection
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display all products', () => {
    const productCards = fixture.debugElement.queryAll(By.css('.product-card'));
    expect(productCards.length).toBe(component.products.length);
  });

  it('should add a product to the cart when clicking "Add to Cart"', () => {
    const spy = jest.spyOn(cartService, 'addToCart');

    const productButtons = fixture.debugElement.queryAll(
      By.css('.btn-primary')
    );
    productButtons[0].nativeElement.click(); // Click first "Add to Cart" button

    expect(spy).toHaveBeenCalledWith(component.products[0]); // Verify correct call
  });
});
