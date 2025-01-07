import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css'],
})
export class AdminloginComponent {
  adminCredentials = { username: '', password: '' };

  constructor(private router: Router) {}

  login() {
    const { username, password } = this.adminCredentials;

    // Hardcoded admin credentials
    if (username === 'admin' && password === 'adminpass') {
      localStorage.setItem('isAdminLoggedIn', 'true'); // Store admin login status
      alert('Welcome, Admin!');
      this.router.navigate(['/admin']); // Navigate to admin dashboard
    } else {
      alert('Invalid admin credentials. Please try again.');
    }
  }

  logout() {
    localStorage.removeItem('isAdminLoggedIn'); // Clear admin login status
    alert('Logout successful!');
    this.router.navigate(['/login']); // Navigate to main login page
  }
}
