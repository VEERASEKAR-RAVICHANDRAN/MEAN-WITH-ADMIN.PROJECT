import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private baseUrl = '/api/banners';

  constructor(private http: HttpClient) {}

  addBanner(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, formData);
  }

  getBanners(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  updateBanner(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }

  deleteBanner(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
