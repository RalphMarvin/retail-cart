import { CartItem } from "../models/cart.interface";

/**
 * Interface for cart storage service.
 * This service handles saving and loading cart items to/from storage (e.g., LocalStorage).
 */
export interface ICartStorage {

  /**
   * Saves the provided cart items to the storage.
   *
   * @param items - An array of cart items to be saved.
   * Each item should contain details like product information and quantity.
   */
  save(items: CartItem[]): void;

  /**
   * Loads the cart items from storage.
   *
   * @returns An array of cart items if they exist in storage, or null if no items are saved.
   * The returned items should include product details and quantities.
   */
  load(): CartItem[] | null;
}
