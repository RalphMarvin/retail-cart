import { Component } from '@angular/core';
import { Product } from '../../models/product.interface';
import { CartService } from '../../services/cart/cart.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  imports: [NgOptimizedImage],
})
export class ProductListComponent {
  products: Product[] = [
    {
      id: 1,
      name: 'Classic T-Shirt',
      price: 12.99,
      imageUrl:
        'https://t3.ftcdn.net/jpg/06/24/96/40/360_F_624964076_839fzV7cOnHuG4lQjkAI9HLiut815H1Q.jpg',
    },
    {
      id: 2,
      name: 'Denim Jeans',
      price: 49.99,
      imageUrl:
        'https://gh.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/34/3024962/1.jpg?3129',
    },
    {
      id: 3,
      name: 'Sneakers',
      price: 89.99,
      imageUrl:
        'https://brands-hub.ru/wp-content/uploads/2020/02/Prada-Men-Shoes-Nylon-and-Leather-Sneakers-Black-3-300x300.jpg',
    },
    {
      id: 4,
      name: 'Baseball Cap',
      price: 24.99,
      imageUrl:
        'https://gh.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/65/8696031/1.jpg?4910',
    },
    {
      id: 5,
      name: 'Ray band Subglasses',
      price: 10.99,
      imageUrl:
        'https://www.sportrx.com/sportrx-blog/wp-content/uploads/2019/07/real-ray-bans-vs-fake-ray-bans.jpg',
    },
    {
      id: 6,
      name: 'Wrist Watch',
      price: 109.99,
      imageUrl:
        'https://rukminim2.flixcart.com/image/850/1000/xif0q/watch/e/v/5/1-watches-axe-style-men-original-imagrtccnbxfty6e.jpeg?q=90&crop=false',
    },
    {
      id: 7,
      name: 'Perfume',
      price: 29.99,
      imageUrl:
        'https://gh.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/12/6895031/1.jpg?9608',
    },
    {
      id: 8,
      name: 'Neck Chains',
      price: 44.99,
      imageUrl:
        'https://gh.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/28/4410711/1.jpg?4677',
    },
  ];

  constructor(private cartService: CartService) {}

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
