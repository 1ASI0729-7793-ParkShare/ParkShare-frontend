import { Routes } from '@angular/router';

/** Emergency routes mounted under /owner. */
export const emergencyOwnerRoutes: Routes = [
  {
    path: 'emergency',
    loadComponent: () =>
      import('./views/owner-emergency-view/owner-emergency-view').then((m) => m.OwnerEmergencyView),
  },
];
