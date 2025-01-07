import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { CartComponent } from '../cart/cart.component';
import { OrderComponent } from '../order/order.component';
import { AuthGuard } from '../auth.guard';
import { HomeComponent } from '../home/home.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AddBannerComponent } from '../admin/add-banner/add-banner.component';
import { FoodComponent } from '../food/food.component';
import { DashTableComponent } from '../dash-table/dash-table.component';
import { AdminloginComponent } from '../adminlogin/adminlogin.component';
import { AdminordersComponent } from '../adminorders/adminorders.component';
import { CategorytableComponent } from '../categorytable/categorytable.component';

const routes: Routes = [
  { path: '', redirectTo: 'cart', pathMatch: 'full' },
  { path: 'home', component: CartComponent },
  // { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // { path: 'admin-login', component: AdminloginComponent },
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
  // { 
  //   path: 'admin', 
  //   component: AdminDashboardComponent, 
  //   canActivate: [AuthGuard], 
    
  // },
  { path: 'order', component: OrderComponent, canActivate: [AuthGuard] },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
