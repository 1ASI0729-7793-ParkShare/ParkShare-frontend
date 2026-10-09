import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { BookingStore } from '../../../application/booking.store';
import { ParkingListing } from '../../../domain/model/parking-listing.entity';
import { DriverSearchView } from './driver-search-view';

const listing = new ParkingListing({
  id: 1, ownerId: 1, name: 'Estacionamiento techado Larco', address: 'Av. Larco 841',
  district: 'Miraflores', hourlyRate: 6, covered: true, rating: 4.8, reviewCount: 42,
  availability: 'available', latitude: -12.12, longitude: -77.03,
});

describe('DriverSearchView', () => {
  let fixture: ComponentFixture<DriverSearchView>;
  const store = {
    criteria: signal({ district: 'Miraflores', maxHourlyRate: 8 }),
    searchResults: signal([listing]),
    vehicle: signal(null),
    activeReservation: signal(null),
    error: signal(null),
    loading: signal(false),
    canReserve: () => true,
    search: vi.fn(),
    reserve: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverSearchView],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: BookingStore, useValue: store },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DriverSearchView);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should list the search results', () => {
    expect(fixture.nativeElement.querySelectorAll('app-listing-card').length).toBe(1);
  });

  it('should ask the store to reserve the chosen listing', () => {
    (fixture.nativeElement.querySelector('app-listing-card button') as HTMLButtonElement).click();
    expect(store.reserve).toHaveBeenCalledWith(listing, expect.any(Function));
  });
});
