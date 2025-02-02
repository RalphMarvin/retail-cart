import { Injectable } from '@angular/core';
import { CartItem } from '../../models/cart.interface';
import { ICartStorage } from '../../repositories/cart-storage.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService implements ICartStorage {
  private readonly CART_KEY = 'cart';

  save(items: CartItem[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(items));
  }

  load(): CartItem[] | null {
    const savedCart = localStorage.getItem(this.CART_KEY);
    if (!savedCart) return null;

    try {
      return JSON.parse(savedCart);
    } catch (error) {
      console.error('Error parsing cart data from localStorage:', error);
      return null;
    }
  }
}
