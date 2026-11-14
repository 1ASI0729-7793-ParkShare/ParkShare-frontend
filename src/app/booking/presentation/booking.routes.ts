import { Routes } from '@angular/router';

const driverSearchView = () =>
  import('./views/driver-search-view/driver-search-view').then((m) => m.DriverSearchView);
const driverReservationView = () =>
  import('./views/driver-reservation-view/driver-reservation-view').then(
    (m) => m.DriverReservationView,
  );
const driverHistoryView = () =>
  import('./views/driver-history-view/driver-history-view').then((m) => m.DriverHistoryView);
const ownerRequestsView = () =>
  import('./views/owner-requests-view/owner-requests-view').then((m) => m.OwnerRequestsView);

/** Booking routes mounted under /driver. */
export const bookingDriverRoutes: Routes = [
  { path: 'search', loadComponent: driverSearchView },
  { path: 'reservation', loadComponent: driverReservationView },
  { path: 'history', loadComponent: driverHistoryView },
];

/** Booking routes mounted under /owner. */
export const bookingOwnerRoutes: Routes = [{ path: 'requests', loadComponent: ownerRequestsView }];
