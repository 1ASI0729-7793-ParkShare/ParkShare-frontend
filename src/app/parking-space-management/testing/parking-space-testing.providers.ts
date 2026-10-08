import { EnvironmentProviders, Provider } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { ParkingSpaceManagementStore } from '../application/parking-space-management.store';
import { ParkingSpaceRepository } from '../application/parking-space.repository';
import { InMemoryParkingSpaceRepository } from '../infrastructure/in-memory-parking-space.repository';

export function provideParkingSpaceTesting(): Array<Provider | EnvironmentProviders> {
  return [
    provideRouter([]),
    provideTranslateService({ lang: 'en', fallbackLang: 'en' }),
    ParkingSpaceManagementStore,
    {
      provide: ParkingSpaceRepository,
      useClass: InMemoryParkingSpaceRepository,
    },
  ];
}
