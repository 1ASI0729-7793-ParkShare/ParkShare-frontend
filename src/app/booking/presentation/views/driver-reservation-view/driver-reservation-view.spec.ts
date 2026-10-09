import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { BookingStore } from '../../../application/booking.store';
import { Reservation } from '../../../domain/model/reservation.entity';
import { DriverReservationView } from './driver-reservation-view';


const inUse = new Reservation({
  id: 2039, parkingListingId: 1, ownerId: 1, driverId: 1, driverName: 'Daniela Ríos',
  vehiclePlate: 'BXQ-418', vehicleModel: 'Toyota Yaris 2021', spaceName: 'Estacionamiento techado Larco',
  spaceAddress: 'Av. Larco 841, Miraflores, Lima', hourlyRate: 6, plannedEntry: new Date().toISOString(),
  plannedHours: 1, status: 'in-use', startedAt: new Date(Date.now() - 74 * 60 * 1000).toISOString(),
  endedAt: null, totalCost: null,
});

describe('DriverReservationView', () => {
  let fixture: ComponentFixture<DriverReservationView>;
  const store = {
    activeReservation: signal<Reservation | null>(inUse),
    error: signal(null),
    loading: signal(false),
    startParking: vi.fn(),
    finishParking: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverReservationView],
      providers: [provideRouter([]), provideTranslateService(), { provide: BookingStore, useValue: store }],
    }).compileComponents();
    fixture = TestBed.createComponent(DriverReservationView);
    fixture.detectChanges();
  });

  it('should show elapsed time and the cost accumulated so far', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('01:14:');
    expect(text).toContain('S/ 7.40');
  });

  it('should mark the exit through the store', () => {
    (fixture.nativeElement.querySelector('button.finish') as HTMLButtonElement).click();
    expect(store.finishParking).toHaveBeenCalledWith(inUse, expect.any(Function));
  });
});
