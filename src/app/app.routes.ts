import { Routes } from '@angular/router';

const baseTitle = 'ParkShare';

const loadPlaceholder = () =>
  import('./shared/presentation/views/home/home').then((component) => component.Home);

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
    path: 'home',
    loadComponent: loadPlaceholder,
    title: `${baseTitle} - Inicio`,
  },
  {
    path: 'search',
    loadComponent: loadPlaceholder,
    title: `${baseTitle} - Buscar cochera`,
  },
  {
    path: 'reservations',
    loadComponent: loadPlaceholder,
    title: `${baseTitle} - Mi reserva`,
  },
  {
    path: 'history',
    loadComponent: loadPlaceholder,
    title: `${baseTitle} - Historial`,
  },
  {
    path: 'dashboard',
    loadComponent: loadPlaceholder,
    title: `${baseTitle} - Panel de control`,
  },
  {
    path: 'requests',
    loadComponent: loadPlaceholder,
    title: `${baseTitle} - Solicitudes de reserva`,
  },
  {
    path: 'earnings',
    loadComponent: loadPlaceholder,
    title: `${baseTitle} - Mis ingresos`,
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
