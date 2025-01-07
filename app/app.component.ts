import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from './cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'zomato';
  isAdminPage = false;
  cartItems: any[] = [];

  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit() {
    // Update cart items whenever the component initializes
    this.cartItems = this.cartService.getCart();

    // Detect route changes
    this.router.events.subscribe(() => {
      this.isAdminPage = this.router.url.includes('/admin');
    });
  }

  navorder() {
    this.router.navigate(['/order']);
  }
}
