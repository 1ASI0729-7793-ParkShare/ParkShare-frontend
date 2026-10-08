import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./parking-space-management/presentation/parking-space-management.routes').then(
        (routes) => routes.parkingSpaceManagementRoutes,
      ),
  },
];
