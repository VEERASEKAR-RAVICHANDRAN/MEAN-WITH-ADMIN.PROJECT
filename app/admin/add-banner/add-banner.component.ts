import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-banner',
  templateUrl: './add-banner.component.html',
  styleUrls: ['./add-banner.component.css'],
})
export class AddBannerComponent implements OnInit {
  banner = {
    name: '',
    description: '',
  };
  selectedFile: File | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {}

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  onSubmit(): void {
    if (!this.banner.name || !this.selectedFile) {
      alert('Banner name and image are required!');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.banner.name);
    if (this.banner.description) {
      formData.append('description', this.banner.description);
    }
    formData.append('bannerImage', this.selectedFile as Blob);

    this.http.post('/api/banners', formData).subscribe({
      next: (response) => {
        alert('Banner added successfully!');
        this.router.navigate(['/banners']); // Navigate to banners list or dashboard
      },
      error: (error) => {
        console.error('Error adding banner:', error);
        alert('Failed to add banner. Please try again.');
      },
    });
  }
}
