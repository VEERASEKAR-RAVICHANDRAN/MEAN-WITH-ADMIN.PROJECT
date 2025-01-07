import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categorytable',
  templateUrl: './categorytable.component.html',
  styleUrls: ['./categorytable.component.css']
})
export class CategorytableComponent  implements OnInit {
  foodTimings: any[] = [];
  isLoading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchFoodTimings();
  }

  // Fetch all food timings from the backend
  fetchFoodTimings(): void {
    this.isLoading = true;
    this.http.get('http://localhost:3000/api/food-timings').subscribe(
      (response: any) => {
        this.foodTimings = response.foodTimings;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error fetching food timings:', error);
        this.isLoading = false;
      }
    );
  }

  // Add a new food timing
  addFoodTiming(time: string): void {
    const type = prompt('Is it Veg or Non-Veg?')?.toLowerCase();
    if (!type || (type !== 'veg' && type !== 'non-veg')) {
      alert('Invalid input. Please enter either "Veg" or "Non-Veg".');
      return;
    }

    this.http
      .post('http://localhost:3000/api/food-timings', { time, type: type.charAt(0).toUpperCase() + type.slice(1) })
      .subscribe(
        (response: any) => {
          alert('Food timing added successfully!');
          this.fetchFoodTimings(); // Refresh the table
        },
        (error: any) => {
          console.error('Error adding food timing:', error);
          alert('Failed to add food timing. Please try again.');
        }
      );
  }

  // Delete a food timing
  deleteFoodTiming(id: string): void {
    if (confirm('Are you sure you want to delete this food timing?')) {
      this.http.delete(`http://localhost:3000/api/food-timings/${id}`).subscribe(
        () => {
          alert('Food timing deleted successfully!');
          this.fetchFoodTimings(); // Refresh the table
        },
        (error: any) => {
          console.error('Error deleting food timing:', error);
          alert('Failed to delete food timing. Please try again.');
        }
      );
    }
  }
}
