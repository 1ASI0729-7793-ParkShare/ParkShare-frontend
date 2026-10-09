import { Routes } from '@angular/router';
import { ParkingSpaceManagementStore } from '../application/parking-space-management.store';
import { ParkingSpaceRepository } from '../application/parking-space.repository';
import {
  InMemoryParkingSpaceRepository,
  PARKING_SPACE_DEMO_DATA,
} from '../infrastructure/in-memory-parking-space.repository';

export const parkingSpaceManagementRoutes: Routes = [
  {
    path: '',
    providers: [
      ParkingSpaceManagementStore,
      {
        provide: ParkingSpaceRepository,
        useClass: InMemoryParkingSpaceRepository,
      },
      {
        provide: PARKING_SPACE_DEMO_DATA,
        useValue: true,
      },
    ],
    children: [
      {
        path: 'parking-spaces',
        loadComponent: () =>
          import('./pages/parking-space-list/parking-space-list').then(
            (component) => component.ParkingSpaceList,
          ),
      },
      {
        path: 'parking-spaces/new',
        loadComponent: () =>
          import('./pages/parking-space-create/parking-space-create').then(
            (component) => component.ParkingSpaceCreate,
          ),
      },
      {
        path: 'parking-spaces/:id/edit',
        loadComponent: () =>
          import('./pages/parking-space-edit/parking-space-edit').then(
            (component) => component.ParkingSpaceEdit,
          ),
      },
      {
        path: 'parking-spaces/:id/availability',
        loadComponent: () =>
          import('./pages/parking-space-availability/parking-space-availability').then(
            (component) => component.ParkingSpaceAvailability,
          ),
      },
      {
        path: 'parking-spaces/:id/pricing',
        loadComponent: () =>
          import('./pages/parking-space-pricing/parking-space-pricing').then(
            (component) => component.ParkingSpacePricing,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'parking-spaces',
      },
    ],
  },
];
