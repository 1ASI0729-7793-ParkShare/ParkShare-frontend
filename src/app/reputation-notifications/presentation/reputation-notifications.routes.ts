import { Routes } from '@angular/router';

export const REPUTATION_NOTIFICATIONS_ROUTES: Routes = [
  {
    path: 'reputation/:userId',
    loadComponent: () =>
      import('./pages/reputation-page/reputation-page.component').then(
        (m) => m.ReputationPageComponent,
      ),
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./pages/notifications-page/notifications-page.component').then(
        (m) => m.NotificationsPageComponent,
      ),
  },
];
