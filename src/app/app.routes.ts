import { Routes } from '@angular/router';

const placeholder = () =>
  import('./shared/presentation/views/placeholder/placeholder').then((m) => m.Placeholder);
const profileRoutes = () =>
  import('./profile/presentation/profile.routes').then((m) => m.profileRoutes);
const paymentsRoutes = () =>
  import('./payments/presentation/payments.routes').then((m) => m.paymentsRoutes);

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'driver/search' },
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
      { path: 'dashboard', loadComponent: placeholder, data: { titleKey: 'nav.owner.dashboard' } },
      { path: 'income', loadChildren: paymentsRoutes, data: { titleKey: 'nav.owner.payments' } },
    ],
  },
  { path: '**', redirectTo: 'driver/search' },
];