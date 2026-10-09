import { Routes } from '@angular/router';

const baseTitle = 'ParkShare';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'profile',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./identity-and-access/presentation/views/driver-profile/driver-profile').then(
        (component) => component.DriverProfile,
      ),
    title: `${baseTitle} - Mi perfil`,
  },
  {
    path: 'parkings',
    pathMatch: 'full',
    redirectTo: 'parking-spaces',
  },
  {
    path: '',
    loadChildren: () =>
      import('./parking-space-management/presentation/parking-space-management.routes').then(
        (parkingRoutes) => parkingRoutes.parkingSpaceManagementRoutes,
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/presentation/views/page-not-found/page-not-found').then(
        (component) => component.PageNotFound,
      ),
    title: `${baseTitle} - Página no encontrada`,
  },
];
