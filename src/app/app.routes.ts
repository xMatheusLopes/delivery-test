import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
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
