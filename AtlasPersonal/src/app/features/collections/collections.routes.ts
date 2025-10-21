import { Routes } from '@angular/router';

export const COLLECTIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./collections-list/collections-list.component').then(m => m.CollectionsListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./collection-create/collection-create.component').then(m => m.CollectionCreateComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./collection-detail/collection-detail.component').then(m => m.CollectionDetailComponent)
  }
];
