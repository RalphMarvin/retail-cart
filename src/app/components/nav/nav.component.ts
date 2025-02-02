import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  private router = inject(Router);
  protected cartService = inject(CartService);

  navigate(path: string, event: Event): void {
    event.preventDefault();
    this.router.navigate([path]);
  }

  navigateHome(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/']);
  }
}
