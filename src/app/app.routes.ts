import { Routes } from '@angular/router';

const placeholder = () =>
  import('./shared/presentation/views/placeholder/placeholder').then((m) => m.Placeholder);
const profileRoutes = () =>
  import('./profile/presentation/profile.routes').then((m) => m.profileRoutes);
const parkingSpaceRoutes = () =>
  import('./parking-space-management/presentation/parking-space-management.routes').then(
    (m) => m.parkingSpaceManagementRoutes,
  );
import { REPUTATION_NOTIFICATIONS_ROUTES }
  from './reputation-notifications/presentation/reputation-notifications.routes';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'driver/search' },
    ...REPUTATION_NOTIFICATIONS_ROUTES,
  {
    path: 'driver',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'search' },
      { path: 'search', loadComponent: placeholder, data: { titleKey: 'nav.driver.search' } },
      {
        path: 'reservation',
        loadComponent: placeholder,
        data: { titleKey: 'nav.driver.reservation' },
      },
      { path: 'history', loadComponent: placeholder, data: { titleKey: 'nav.driver.history' } },
      { path: 'profile', loadChildren: profileRoutes },
    ],
  },
  {
    path: 'owner',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: placeholder,
        data: { titleKey: 'nav.owner.dashboard' },
      },
      {
        path: 'requests',
        loadComponent: placeholder,
        data: { titleKey: 'nav.owner.requests' },
      },
      {
        path: 'earnings',
        loadComponent: placeholder,
        data: { titleKey: 'nav.owner.earnings' },
      },
      { path: '', loadChildren: parkingSpaceRoutes },
    ],
  },
  { path: 'profile', pathMatch: 'full', redirectTo: 'driver/profile' },
  { path: 'search', pathMatch: 'full', redirectTo: 'driver/search' },
  { path: 'reservations', pathMatch: 'full', redirectTo: 'driver/reservation' },
  { path: 'history', pathMatch: 'full', redirectTo: 'driver/history' },
  { path: 'dashboard', pathMatch: 'full', redirectTo: 'owner/dashboard' },
  { path: 'requests', pathMatch: 'full', redirectTo: 'owner/requests' },
  { path: 'parking-spaces/new', pathMatch: 'full', redirectTo: 'owner/parking-spaces/new' },
  {
    path: 'parking-spaces/:id/edit',
    pathMatch: 'full',
    redirectTo: 'owner/parking-spaces/:id/edit',
  },
  {
    path: 'parking-spaces/:id/availability',
    pathMatch: 'full',
    redirectTo: 'owner/parking-spaces/:id/availability',
  },
  {
    path: 'parking-spaces/:id/pricing',
    pathMatch: 'full',
    redirectTo: 'owner/parking-spaces/:id/pricing',
  },
  { path: 'parking-spaces', pathMatch: 'full', redirectTo: 'owner/parking-spaces' },
  { path: 'parkings', pathMatch: 'full', redirectTo: 'owner/parking-spaces' },
  { path: 'earnings', pathMatch: 'full', redirectTo: 'owner/earnings' },
  { path: '**', redirectTo: 'driver/search' },

];
