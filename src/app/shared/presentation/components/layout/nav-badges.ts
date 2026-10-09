import { InjectionToken, signal, Signal } from '@angular/core';

export const NAV_BADGES = new InjectionToken<Signal<Record<string, number>>>('NAV_BADGES', {
  providedIn: 'root',
  factory: () => signal({}),
});
