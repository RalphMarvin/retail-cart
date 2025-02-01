import { Component } from '@angular/core';
import { Product } from '../../models/product.interface';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: Product[] = [
    { id: 1, name: 'Classic T-Shirt', price: 19.99, imageUrl: 'https://t3.ftcdn.net/jpg/06/24/96/40/360_F_624964076_839fzV7cOnHuG4lQjkAI9HLiut815H1Q.jpg' },
    { id: 2, name: 'Denim Jeans', price: 49.99, imageUrl: 'https://gh.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/34/3024962/1.jpg?3129' },
    { id: 3, name: 'Sneakers', price: 79.99, imageUrl: 'https://brands-hub.ru/wp-content/uploads/2020/02/Prada-Men-Shoes-Nylon-and-Leather-Sneakers-Black-3-300x300.jpg' },
    { id: 4, name: 'Baseball Cap', price: 24.99, imageUrl: 'https://gh.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/65/8696031/1.jpg?4910' }
  ];

  constructor(private cartService: CartService) {}

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
