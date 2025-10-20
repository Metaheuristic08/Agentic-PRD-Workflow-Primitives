import { Routes } from '@angular/router';

export const PINS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pins-list/pins-list.component').then(m => m.PinsListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./pin-create/pin-create.component').then(m => m.PinCreateComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pin-detail/pin-detail.component').then(m => m.PinDetailComponent)
  }
];
