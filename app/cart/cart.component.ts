import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../app.service';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';  // Import Bootstrap JS

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent  implements OnInit, AfterViewInit {
  products: any[] = [];
  cart: any[] = [];
  recentlyAdded: { [key: string]: boolean } = {}; // To track added products

  constructor(private apiService: ApiService, private router: Router) {}
  
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  async ngOnInit() {
    try {
      const response = await this.apiService.getProducts();
      this.products = response.products; // Populate products from API response
    } catch (error) {
      console.error('Error fetching products:', error);
    }

    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    }
  }

  getProductQuantity(productId: string): number {
    const item = this.cart.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  }

  addToCart(product: any, quantity: number) {
    const index = this.cart.findIndex((item) => item.productId === product._id);
    if (index >= 0) {
      this.cart[index].quantity += quantity;
    } else {
      this.cart.push({
        productId: product._id,
        productName: product.name,
        productPrice: product.price,
        quantity: quantity,
      });
    }
    localStorage.setItem('cart', JSON.stringify(this.cart));

    // Display the "added to cart" message
    this.recentlyAdded[product._id] = true;
    setTimeout(() => {
      this.recentlyAdded[product._id] = false;
    }, 3000); // Hide message after 3 seconds
  }

  removeFromCart(productId: string) {
    const index = this.cart.findIndex((item) => item.productId === productId);
    if (index >= 0) {
      this.cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  incrementQuantity(productId: string) {
    const index = this.cart.findIndex((item) => item.productId === productId);
    if (index >= 0) {
      this.cart[index].quantity += 1;
    } else {
      const product = this.products.find((prod) => prod._id === productId);
      if (product) {
        this.addToCart(product, 1);
      }
    }
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  decrementQuantity(productId: string) {
    const index = this.cart.findIndex((item) => item.productId === productId);
    if (index >= 0 && this.cart[index].quantity > 1) {
      this.cart[index].quantity -= 1;
    } else if (index >= 0 && this.cart[index].quantity === 1) {
      this.removeFromCart(productId);
    }
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  calculateTotalPrice(): number {
    return this.cart.reduce(
      (total, item) => total + item.productPrice * item.quantity,
      0
    );
  }

  placeOrder() {
    if (this.cart.length === 0) {
      alert('Your cart is empty. Add items before placing an order!');
      return;
    }
    this.router.navigate(['/order']); // Redirect to order
  }
}