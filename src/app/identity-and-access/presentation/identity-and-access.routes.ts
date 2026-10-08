import { Routes } from '@angular/router';
import { DriverProfile } from './views/driver-profile/driver-profile';

export const identityAndAccessRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'profile',
        component: DriverProfile,
        title: 'ParkShare - Mi perfil',
      },
    ],
  },
];
