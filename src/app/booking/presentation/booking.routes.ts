import { Routes } from '@angular/router';

export const bookingRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'search' },
  {
    path: 'search',
    loadComponent: () =>
      import('./views/driver-search/driver-search').then((m) => m.DriverSearch),
    data: { titleKey: 'nav.driver.search' },
  },
  {
    path: 'reservation',
    loadComponent: () =>
      import('./views/driver-reservation/driver-reservation').then((m) => m.DriverReservation),
    data: { titleKey: 'nav.driver.reservation' },
  },
  {
    path: 'requests',
    loadComponent: () =>
      import('./views/owner-requests/owner-requests').then((m) => m.OwnerRequests),
    data: { titleKey: 'nav.owner.requests' },
  },
];
