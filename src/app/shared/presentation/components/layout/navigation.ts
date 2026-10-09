export type UserRole = 'driver' | 'owner';

export interface NavOption {
  labelKey: string;
  icon: string;
  route: string;
}

export interface RoleOption {
  role: UserRole;
  labelKey: string;
  route: string;
}

export const ROLES: RoleOption[] = [
  { role: 'driver', labelKey: 'roles.driver', route: '/driver' },
  { role: 'owner', labelKey: 'roles.owner', route: '/owner' },
];

export const NAV_OPTIONS: Record<UserRole, NavOption[]> = {
  driver: [
    { labelKey: 'nav.driver.search', icon: 'search', route: '/driver/search' },
    { labelKey: 'nav.driver.reservation', icon: 'schedule', route: '/driver/reservation' },
    { labelKey: 'nav.driver.history', icon: 'history', route: '/driver/history' },
    { labelKey: 'nav.driver.profile', icon: 'person_outline', route: '/driver/profile' },
  ],
  owner: [{ labelKey: 'nav.owner.dashboard', icon: 'local_parking', route: '/owner' }],
};
