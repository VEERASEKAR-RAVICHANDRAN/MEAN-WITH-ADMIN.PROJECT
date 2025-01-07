import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Check if the user is logged in
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    const userToken = localStorage.getItem('token');

    // If the route requires admin access
    const requiresAdmin = route.data['requiresAdmin'];
    if (requiresAdmin) {
      if (isAdminLoggedIn) {
        return true; // Allow navigation for admin
      } else {
        alert('Access denied. Admins only!');
        this.router.navigate(['/login']); // Redirect non-admins to login
        return false;
      }
    }

    // For routes that do not require admin access, check regular user login
    if (!userToken) {
      alert('You need to log in to access this page.');
      this.router.navigate(['/login']); // Redirect to login
      return false;
    }

    return true; // Allow navigation for logged-in users
  }
}
