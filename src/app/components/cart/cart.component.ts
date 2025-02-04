import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
export class CartComponent implements OnInit, OnDestroy {
  cart = inject(CartService);
  private fb = inject(FormBuilder);

  discountForm: FormGroup;
  discountMessage = signal<string>('');
  discountApplied = signal<boolean>(false);
  errorMessage = '';
  errorTimeout: any;
  discountCodeApplied = signal<string>('');

  constructor() {
    this.discountForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  ngOnInit(): void {
    window.addEventListener('keydown', this.clearError);
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.clearError);
    this.clearError();
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
      if (result.success) {
        this.discountCodeApplied.set(this.discountForm.value.code);
        this.discountForm.reset();
      } else {
        this.showError(result.message);
        this.discountCodeApplied.set('');
      }
    }
  }

  clearDiscount(): void {
    this.discountForm.reset();
    this.discountApplied.set(false); // Ensure the discount applied signal is reset
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.errorTimeout && clearTimeout(this.errorTimeout);
    this.errorTimeout = setTimeout(() => {
      this.errorMessage = '';
    }, 5000); // Clear the error message after 5 seconds
  }

  clearError = (): void => {
    this.errorMessage = '';
    clearTimeout(this.errorTimeout);
  };
}
