// login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = { email: '', password: '' };
// password: any;
// loginError: any;

  constructor(private apiService: ApiService, private router: Router) {}

  // Check if user is already logged in
  get isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }

  async login() {
    try {
      // // Admin authentication check
      // if (
      //   this.credentials.email === 'adminlogin' &&
      //   this.credentials.password === 'adminlogin'
      // ) {
      //   localStorage.setItem('isAdminLoggedIn', 'true'); // Set admin login flag
      //   alert('Welcome, Admin!');
      //   this.router.navigate(['/admin']); // Redirect to admin dashboard
      //   return;
      // }

      // Regular user authentication
      const response = await this.apiService.login(this.credentials);
      console.log(this.credentials);

      if (response.success && response.data.token) {
        localStorage.setItem('token', response.data.token); // Store token for regular user
        alert('Login successful!');
        this.router.navigate(['/order']); // Redirect to order page
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      console.log(this.credentials);

      alert('Login failed. Please check your email and password or register.');
      this.router.navigate(['/register']);
    }
  }

  logout() {
    localStorage.removeItem('token'); // Remove user token
    // localStorage.removeItem('isAdminLoggedIn'); // Remove admin login flag
    alert('Logout successful!');
    this.router.navigate(['/login']); // Redirect to login page after logout
  }
}
