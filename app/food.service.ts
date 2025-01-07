import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  private baseUrl = 'http://localhost:3000/api/products'; // Adjust the base URL as needed.

  constructor(private http: HttpClient) {}

  // Get all products
  getProducts(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  // Add a new product
  addProduct(productData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, productData);
  }

  // Update an existing product
  updateProduct(id: any, productData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, productData); // Corrected template literal usage
  }

  // Delete a product
  deleteProduct(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`); // Corrected template literal usage
  }
}
