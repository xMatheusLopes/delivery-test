import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => 
      import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'entregas',
    loadComponent: () => 
      import('./deliveries/deliveries.component').then(m => m.DeliveriesComponent)
  }
];
