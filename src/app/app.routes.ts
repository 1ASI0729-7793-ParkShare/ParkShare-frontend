import { Routes } from '@angular/router';

import { ParkingSpaceList } from './parking-space-management/presentation/pages/parking-space-list/parking-space-list';
import { DriverProfile } from './identity-and-access/presentation/views/driver-profile/driver-profile';
import { Home } from './shared/presentation/views/home/home';

const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found').then(
    (m) => m.PageNotFound
  );

const baseTitle = 'ParkShare';

export const routes: Routes = [
  // Rutas Conductor
  {
    path: 'profile',
    component: DriverProfile,
    title: `${baseTitle} - Mi perfil`,
  },
  {
    path: 'home',
    component: Home,
    title: `${baseTitle} - Inicio`,
  },
  {
    path: 'search',
    component: DriverProfile,
    title: `${baseTitle} - Buscar cochera`,
  },
  {
    path: 'reservations',
    component: DriverProfile,
    title: `${baseTitle} - Mi reserva`,
  },
  {
    path: 'history',
    component: DriverProfile,
    title: `${baseTitle} - Historial`,
  },

  // Rutas Propietario
  {
    path: 'dashboard',
    component: ParkingSpaceList,
    title: `${baseTitle} - Panel de control`,
  },
  {
    path: 'requests',
    component: DriverProfile,
    title: `${baseTitle} - Solicitudes de reserva`,
  },
  {
    path: 'parkings',
    component: ParkingSpaceList,
    title: `${baseTitle} - Mis cocheras`,
  },
  {
    path: 'earnings',
    component: ParkingSpaceList,
    title: `${baseTitle} - Mis ingresos`,
  },

  {
    path: '',
    redirectTo: '/profile',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: pageNotFound,
    title: `${baseTitle} - Página no encontrada`,
  },
];
