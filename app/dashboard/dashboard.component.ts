import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  stats = {
    totalOrders: 758,
    totalRevenue: 147100,
    totalUsers: 902,
    peopleOnline: 2,
  };

  constructor() {}

  ngOnInit() {
    this.loadSalesChart();
  }

  loadSalesChart() {
    const canvas = <HTMLCanvasElement>document.getElementById('salesChart');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [
            {
              label: 'Orders',
              data: [50, 60, 70, 80],
              borderColor: 'blue',
              fill: false,
            },
            {
              label: 'Revenue',
              data: [200, 300, 400, 500],
              borderColor: 'green',
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });
    }
  }
}
