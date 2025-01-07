import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent  implements OnInit {
  selectedSection: string = 'dashboard';
  // stats = {
  //   totalOrders: 120,
  //   totalRevenue: 5000,
  //   totalUsers: 300,
  // };
  // products = [
  //   { name: 'Product 1', category: 'Category 1', price: 20 },
  //   { name: 'Product 2', category: 'Category 2', price: 35 },
  // ];
  // orders = [
  //   { id: 1, user: 'User 1', total: 50, status: 'Pending' },
  //   { id: 2, user: 'User 2', total: 75, status: 'Completed' },
  // ];
  // users = [
  //   { id: 1, name: 'Admin', email: 'admin@example.com' },
  //   { id: 2, name: 'User 1', email: 'user1@example.com' },
  // ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Simulate data fetching here
  }

  selectSection(section: string) {
    this.selectedSection = section;
  }

  logout() {
    localStorage.removeItem('authToken'); // Clear token
    this.router.navigate(['/login']); // Redirect to login
  }

  // Example methods
  addProduct() {
    alert('Add Product clicked!');
  }

  editProduct(product: any) {
    alert(`Edit Product: ${product.name}`);
  }

  deleteProduct(product: any) {
    alert(`Delete Product: ${product.name}`);
  }

  viewOrder(order: any) {
    alert(`View Order ID: ${order.id}`);
  }

  updateOrderStatus(order: any) {
    alert(`Update Status for Order ID: ${order.id}`);
  }

  editUser(user: any) {
    alert(`Edit User: ${user.name}`);
  }

  deleteUser(user: any) {
    alert(`Delete User: ${user.name}`);
  }
 navigateuser(){
  this.router.navigate(['/admin/user']);
 }
 navigateproduct(){
  this.router.navigate(['/admin/product']);
 }
 navigateorder(){
  this.router.navigate(['/admin/orders']);
 }
 navigatecategories(){
  this.router.navigate(['/admin/categories']);
 }
}

