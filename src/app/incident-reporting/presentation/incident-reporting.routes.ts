import { Routes } from '@angular/router';

const driverIncidentsView = () =>
  import('./views/driver-incidents-view/driver-incidents-view').then((m) => m.DriverIncidentsView);
const ownerIncidentsView = () =>
  import('./views/owner-incidents-view/owner-incidents-view').then((m) => m.OwnerIncidentsView);

/** Incident routes mounted under /driver. */
export const incidentDriverRoutes: Routes = [{ path: 'incidents', loadComponent: driverIncidentsView }];

/** Incident routes mounted under /owner. */
export const incidentOwnerRoutes: Routes = [{ path: 'incidents', loadComponent: ownerIncidentsView }];
