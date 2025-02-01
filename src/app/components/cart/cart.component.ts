import { Component, inject, signal } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class CartComponent {
  cartService = inject(CartService);
  private fb = inject(FormBuilder);

  discountForm: FormGroup;
  discountMessage = signal<string>('');
  discountSuccess = signal<boolean>(false);
  discountAmount = signal<number>(0);

  constructor() {
    this.discountForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  applyDiscount(): void {
    if (this.discountForm.valid) {
      const result = this.cartService.applyDiscount(this.discountForm.value.code);
      this.discountMessage.set(result.message);
      this.discountSuccess.set(result.success);
      this.discountAmount.set(result.discount || 0);
    }
  }
}
