import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodTimingService {

  constructor(private http: HttpClient) {}

  getFoodTypes(): Observable<any> {
    return this.http.get('http://localhost:3000/api/food-timings');  // Endpoint to get food types
  }
}
