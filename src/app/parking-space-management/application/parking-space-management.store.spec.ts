import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { InMemoryParkingSpaceRepository } from '../infrastructure/in-memory-parking-space.repository';
import { ParkingSpaceManagementStore } from './parking-space-management.store';
import { ParkingSpaceRepository } from './parking-space.repository';

describe('ParkingSpaceManagementStore', () => {
  let store: ParkingSpaceManagementStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ParkingSpaceManagementStore,
        {
          provide: ParkingSpaceRepository,
          useClass: InMemoryParkingSpaceRepository,
        },
      ],
    });
    store = TestBed.inject(ParkingSpaceManagementStore);
  });

  it('should create and retain a parking space', async () => {
    const created = await firstValueFrom(
      store.createParkingSpace({
        address: 'Av. Test 123',
        photos: ['https://example.com/photo.jpg'],
        hourlyRate: 8.5,
        availability: [
          {
            dayOfWeek: 'monday',
            startTime: '08:00',
            endTime: '18:00',
          },
        ],
      }),
    );

    expect(created.id).toBe(1);
    expect(store.parkingSpaces()).toHaveLength(1);
    expect(store.parkingSpaces()[0].address).toBe('Av. Test 123');
    expect(store.error()).toBeNull();
  });

  it('should update pricing and availability independently', async () => {
    const created = await firstValueFrom(
      store.createParkingSpace({
        address: 'Av. Test 456',
        photos: [],
        hourlyRate: 5,
        availability: [],
      }),
    );

    await firstValueFrom(store.updatePricing(created.id, 12));
    await firstValueFrom(
      store.updateAvailability(created.id, [
        {
          dayOfWeek: 'saturday',
          startTime: '09:00',
          endTime: '14:00',
        },
      ]),
    );

    expect(store.parkingSpaces()[0].hourlyRate).toBe(12);
    expect(store.parkingSpaces()[0].availability[0].dayOfWeek).toBe('saturday');
  });

  it('should pause and reactivate a publication', async () => {
    const created = await firstValueFrom(
      store.createParkingSpace({
        address: 'Av. Test 789',
        photos: [],
        hourlyRate: 6,
        availability: [],
      }),
    );

    await firstValueFrom(store.updatePublicationStatus(created.id, 'paused'));
    expect(store.parkingSpaces()[0].publicationStatus).toBe('paused');

    await firstValueFrom(store.updatePublicationStatus(created.id, 'published'));
    expect(store.parkingSpaces()[0].publicationStatus).toBe('published');
  });
});
