
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: any[] = []; // Original list of products

  constructor(private apiService: ApiService, private router: Router) {}

  async ngOnInit() {
    try {
      // Fetch products from the API
      const response = await this.apiService.getProducts();
      console.log('API Response:', response); 
      this.products = response.products;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  // Add product to the cart and save it to localStorage
  addToCart(product: any) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const index = cart.findIndex((item: any) => item.productId === product._id);

    if (index >= 0) {
      // If product already exists in cart, increment the quantity
      cart[index].quantity += 1;
    } else {
      // Add new product to the cart
      cart.push({
        productId: product._id,
        productName: product.name,
        productPrice: product.price,
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
    // alert(`${product.name} added to cart!`);
  }
}