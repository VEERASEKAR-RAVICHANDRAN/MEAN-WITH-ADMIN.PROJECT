import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router'; // Import RouterModule and Routes

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ApiService } from './app.service';
import { ShowOrderComponent } from './show-order/show-order.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { EditProductComponent } from './admin/edit-product/edit-product.component';
import { AddBannerComponent } from './admin/add-banner/add-banner.component';
import { EditBannerComponent } from './admin/edit-banner/edit-banner.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { ManageBannersComponent } from './manage-banners/manage-banners.component';
import { DashTableComponent } from './dash-table/dash-table.component';
import { HttpClientModule } from '@angular/common/http';
import { FilterPipe } from './filter.pipe';
import { FoodComponent } from './food/food.component';
import { AuthGuard } from './auth.guard';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { AdminordersComponent } from './adminorders/adminorders.component';
import { CategorytableComponent } from './categorytable/categorytable.component';

// Define routes
const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route
  // { path: 'cart', component: CartComponent }, // Cart route
  { path: 'order', component: OrderComponent }, // Order route
  { path: 'login', component: LoginComponent }, // Login route
  { path: 'register', component: RegisterComponent }, // Register route
  {
    path: 'admin-login',
    component: AdminloginComponent,
    canActivate: [AuthGuard],
    data: { requiresAdmin: true },
    // Restrict this route to admins
  },
  { path: 'admin', component: AdminDashboardComponent,
    children: [
      { path: '', component:DashboardComponent, pathMatch: 'full' },
      { path: 'user', component: DashTableComponent },
      { path: 'categories', component: CategorytableComponent },
      { path: 'product', component: FoodComponent },
      { path: 'orders', component: AdminordersComponent },
    ],
   }, 
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard], // Accessible to all logged-in users
  },
  // { path: 'admin/products', component: ManageProductsComponent },
  // { path: 'admin/banners', component: ManageBannersComponent },
  { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' }, // Default route
  
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CartComponent,
    OrderComponent,
    LoginComponent,
    RegisterComponent,
    ShowOrderComponent,
    AdminPanelComponent,
    AddProductComponent,
    EditProductComponent,
    AddBannerComponent,
    EditBannerComponent,
    DashboardComponent,
    AdminDashboardComponent,
    ManageProductsComponent,
    ManageBannersComponent,
    DashTableComponent,
    FilterPipe,
    FoodComponent,
    AdminloginComponent,
    AdminordersComponent,
    CategorytableComponent,
    // MatCardModule,
    // MatToolbarModule,
    // MatSidenavModule,
    // MatListModule,
    // MatCardModule,
    // MatIconModule,
    // MatIconModule
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule, // Register routes
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
