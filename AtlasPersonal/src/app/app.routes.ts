import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'map',
    loadChildren: () => import('./features/map/map.routes').then(m => m.MAP_ROUTES)
  },
  {
    path: 'pins',
    loadChildren: () => import('./features/pins/pins.routes').then(m => m.PINS_ROUTES)
  },
  {
    path: 'collections',
    loadChildren: () => import('./features/collections/collections.routes').then(m => m.COLLECTIONS_ROUTES)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
