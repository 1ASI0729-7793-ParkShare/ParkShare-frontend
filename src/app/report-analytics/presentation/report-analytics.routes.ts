import { Routes } from '@angular/router';

const ownerDashboardView = () =>
  import('./views/owner-dashboard-view/owner-dashboard-view').then((m) => m.OwnerDashboardView);

export const reportAnalyticsRoutes: Routes = [{ path: '', loadComponent: ownerDashboardView }];
