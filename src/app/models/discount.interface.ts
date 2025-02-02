export interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
}

export interface DiscountResult {
  success: boolean;
  message: string;
  discount?: number;
}
