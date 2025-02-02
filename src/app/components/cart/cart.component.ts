import { Component, inject, signal } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  imports: [FormsModule, ReactiveFormsModule, NgOptimizedImage, CurrencyPipe],
})
export class CartComponent {
  cart = inject(CartService);
  private fb = inject(FormBuilder);

  discountForm: FormGroup;
  discountMessage = signal<string>('');
  discountApplied = signal<boolean>(false);

  constructor() {
    this.discountForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cart.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cart.removeFromCart(productId);
  }

  applyDiscount(): void {
    if (this.discountForm.valid) {
      const result = this.cart.applyDiscount(this.discountForm.value.code);
      this.discountMessage.set(result.message);
      this.discountApplied.set(result.success);

      if (result.success) {
        this.discountForm.reset();
      }
    }
  }
}
