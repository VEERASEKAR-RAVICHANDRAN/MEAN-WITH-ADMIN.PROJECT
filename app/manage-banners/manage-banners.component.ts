import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manage-banners',
  templateUrl: './manage-banners.component.html',
})
export class ManageBannersComponent implements OnInit {
  banners: any[] = [];
  bannerData = { name: '' };
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadBanners();
  }

  loadBanners() {
    // Fetch banners (if API exists)
  }

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addBanner() {
    const formData = new FormData();
    formData.append('name', this.bannerData.name);
    if (this.selectedFile) {
      formData.append('bannerImage', this.selectedFile);
    }

    this.http.post('http://localhost:3000/api/admin/banner', formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).subscribe(() => {
      this.loadBanners();
    });
  }
}