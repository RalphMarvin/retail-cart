import { CartItem } from "../models/cart.interface";

export interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
}
