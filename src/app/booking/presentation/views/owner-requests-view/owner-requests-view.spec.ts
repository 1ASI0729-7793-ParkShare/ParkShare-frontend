import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { BookingStore } from '../../../application/booking.store';
import { Reservation } from '../../../domain/model/reservation.entity';
import { OwnerRequestsView } from './owner-requests-view';

const requested = new Reservation({
  id: 2039, parkingListingId: 1, ownerId: 1, driverId: 1, driverName: 'Daniela Ríos',
  vehiclePlate: 'BXQ-418', vehicleModel: 'Toyota Yaris', spaceName: 'Estacionamiento techado Larco',
  spaceAddress: 'Av. Larco 841, Miraflores', hourlyRate: 6, plannedEntry: new Date().toISOString(),
  plannedHours: 3, status: 'requested', startedAt: null, endedAt: null, totalCost: null,
});

describe('OwnerRequestsView', () => {
  let fixture: ComponentFixture<OwnerRequestsView>;
  const store = {
    ownerReservations: signal([requested]),
    error: signal(null),
    loading: signal(false),
    acceptRequest: vi.fn(),
    rejectRequest: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerRequestsView],
      providers: [provideTranslateService(), { provide: BookingStore, useValue: store }],
    }).compileComponents();
    fixture = TestBed.createComponent(OwnerRequestsView);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should accept a request through the store', () => {
    const buttons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    buttons[1].click();
    expect(store.acceptRequest).toHaveBeenCalledWith(requested);
  });

  it('should reject a request through the store', () => {
    const buttons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    buttons[0].click();
    expect(store.rejectRequest).toHaveBeenCalledWith(requested);
  });
});
