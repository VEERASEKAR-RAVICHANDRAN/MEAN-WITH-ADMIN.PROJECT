import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: any[] = [];

  constructor() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    }
  }

  getCart() {
    return this.cart;
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
        productImage: product.image || 'assets/default-image.jpg',
        quantity: quantity,
      });
    }
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  removeFromCart(productId: string) {
    const index = this.cart.findIndex((item) => item.productId === productId);
    if (index >= 0) {
      this.cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }
}
