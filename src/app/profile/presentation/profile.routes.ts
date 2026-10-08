import { Routes } from '@angular/router';

const profileView = () => import('./views/profile-view/profile-view').then((m) => m.ProfileView);

export const profileRoutes: Routes = [{ path: '', loadComponent: profileView }];
