import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-adminorders',
  templateUrl: './adminorders.component.html',
  styleUrls: ['./adminorders.component.css']
})
export class AdminordersComponent  implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  searchQuery: string = '';
  isLoading: boolean = true;
  selectAll: boolean = false;
  showPopup: boolean = false;
  selectedOrder: any = null;
  selectedOrderIndex: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchOrders();
    this.filteredOrders = this.orders;
  }




  // fetchOrders(page: number = 1, limit: number = 10): void {
  //   this.isLoading = true;
  //   this.http
  //     .get(`http://localhost:3000/api/orders?page=${page}&limit=${limit}`)
  //     .subscribe(
  //       (response: any) => {
  //         this.orders = response.orders.reverse().map((order: any) => ({
  //           ...order,
  //           selected: false
  //         }));
  //         this.filteredOrders = [...this.orders];
  //         this.isLoading = false;
  //       },
  //       (error) => {
  //         console.error('Error fetching orders:', error);
  //         this.isLoading = false;
  //       }
  //     );
  // }
  fetchOrders(page: number = 1, limit: number = 10): void {
    this.isLoading = true;
    this.http
      .get(`http://localhost:3000/api/orders?page=${page}&limit=${limit}`)
      .subscribe(
        (response: any) => {
          this.orders = response.orders.map((order: any) => ({
            ...order,
            selected: false,
          }));
          this.filteredOrders = [...this.orders];
          this.totalPages = response.totalPages; // Total pages from backend
          this.currentPage = page; // Track current page
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching orders:', error);
          this.isLoading = false;
        }
      );
  }
   
  

  toggleSelectAll(): void {
    this.filteredOrders.forEach((order) => {
      order.selected = this.selectAll;
    });
  }

  viewOrder(order: any, index: number): void {
    this.selectedOrder = order;
    this.selectedOrderIndex = index;
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
    this.selectedOrder = null;
  }


  editOrder(order: any): void {
    const updatedStatus = prompt('Enter new status for the order:', order.status);
  
    if (updatedStatus) {
      const updatedOrder = { ...order, status: updatedStatus };
      this.http.put(`http://localhost:3000/api/orders/${order._id}`, updatedOrder).subscribe(
        (response: any) => {
          const index = this.orders.findIndex((o) => o._id === order._id);
          if (index !== -1) {
            this.orders[index] = response.order;
            this.filteredOrders = [...this.orders];
          }
          // alert('Order updated successfully.');
        },
        (error) => {
          console.error('Error updating order:', error);
        }
      );
    }
  }
  

  deleteOrder(orderId: string): void {
  if (confirm('Are you sure you want to delete this order?')) {
    this.http.delete(`http://localhost:3000/api/orders/${orderId}`).subscribe(
      () => {
        this.orders = this.orders.filter((order) => order._id !== orderId);
        this.filteredOrders = [...this.orders];
        alert('Order deleted successfully.');
      },
      (error) => {
        console.error('Error deleting order:', error);
      }
    );
  }
}


deleteSelectedOrders(): void {
  const selectedOrderIds = this.filteredOrders
    .filter((order) => order.selected)
    .map((order) => order._id);

  if (selectedOrderIds.length === 0) {
    alert('No orders selected for deletion.');
    return;
  }

  if (confirm('Are you sure you want to delete the selected orders?')) {
    this.http.post('http://localhost:3000/api/orders/delete-multiple', { ids: selectedOrderIds })
      .subscribe(
        () => {
          this.orders = this.orders.filter((order) => !selectedOrderIds.includes(order._id));
          this.filteredOrders = [...this.orders];
          alert('Selected orders deleted successfully.');
        },
        (error) => {
          console.error('Error deleting selected orders:', error);
        }
      );
  }
}


  // editOrder(order: any): void {
  //   // Open a popup or redirect to an edit form (e.g., modal or separate route)
  //   const updatedStatus = prompt('Enter new status for the order:', order.status);
  //   if (updatedStatus) {
  //     const updatedOrder = { ...order, status: updatedStatus };
  //     this.http.put(`http://localhost:3000/api/orders/${order._id}`, updatedOrder).subscribe(
  //       (response: any) => {
  //         const index = this.orders.findIndex((o) => o._id === order._id);
  //         if (index !== -1) {
  //           this.orders[index] = { ...response.order };
  //           this.filteredOrders = this.orders;
  //         }
  //         alert('Order updated successfully.');
  //       },
  //       (error) => {
  //         console.error('Error updating order:', error);
  //       }
  //     );
  //   }
  // }
  

  // deleteOrder(orderId: string): void {
  //   if (confirm('Are you sure you want to delete this order?')) {
  //     this.http.delete(`http://localhost:3000/api/orders/${orderId}`).subscribe(
  //       () => {
  //         this.orders = this.orders.filter((order) => order._id !== orderId);
  //         this.filteredOrders = this.orders;
  //         alert('Order deleted successfully.');
  //       },
  //       (error) => {
  //         console.error('Error deleting order:', error);
  //       }
  //     );
  //   }
  // }

  // deleteSelectedOrders(): void {
  //   const selectedOrderIds = this.filteredOrders
  //     .filter((order) => order.selected)
  //     .map((order) => order._id);
  
  //   if (selectedOrderIds.length === 0) {
  //     alert('No orders selected for deletion.');
  //     return;
  //   }
  
  //   if (confirm('Are you sure you want to delete the selected orders?')) {
  //     this.http
  //       .post('http://localhost:3000/api/orders/delete-multiple', { ids: selectedOrderIds })
  //       .subscribe(
  //         () => {
  //           this.orders = this.orders.filter((order) => !selectedOrderIds.includes(order._id));
  //           this.filteredOrders = this.orders;
  //           alert('Selected orders deleted successfully.');
  //         },
  //         (error) => {
  //           console.error('Error deleting selected orders:', error);
  //         }
  //       );
  //   }
  // }

  filterOrders(): void {
  const query = this.searchQuery.toLowerCase().trim();
  if (query) {
    this.filteredOrders = this.orders.filter((order) =>
      order.totalAmount.toString().includes(query) ||
      order.status.toLowerCase().includes(query) ||
      order.paymentMethod.toLowerCase().includes(query) ||
      order.paymentStatus?.toLowerCase().includes(query) ||
      order.shippingAddress?.street.toLowerCase().includes(query) ||
      order.shippingAddress?.city.toLowerCase().includes(query)
    );
  } else {
    this.filteredOrders = [...this.orders];
  }
}

currentPage: number = 1;
totalPages: number = 1;

goToPage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.fetchOrders(page);
  }
}

nextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.goToPage(this.currentPage + 1);
  }
}

previousPage(): void {
  if (this.currentPage > 1) {
    this.goToPage(this.currentPage - 1);
  }
}

}