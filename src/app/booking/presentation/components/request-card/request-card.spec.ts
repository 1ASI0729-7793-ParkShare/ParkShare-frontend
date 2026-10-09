import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { Reservation } from '../../../domain/model/reservation.entity';
import { RequestCard } from './request-card';

const reservation = (status: Reservation['status']) =>
  new Reservation({
    id: 2039, parkingListingId: 1, ownerId: 1, driverId: 1, driverName: 'Daniela Ríos',
    vehiclePlate: 'BXQ-418', vehicleModel: 'Toyota Yaris', spaceName: 'Estacionamiento techado Larco',
    spaceAddress: 'Av. Larco 841, Miraflores', hourlyRate: 6, plannedEntry: new Date().toISOString(),
    plannedHours: 3, status, startedAt: null, endedAt: null, totalCost: null,
  });

describe('RequestCard', () => {
  let fixture: ComponentFixture<RequestCard>;

  const create = async (status: Reservation['status']) => {
    fixture = TestBed.createComponent(RequestCard);
    fixture.componentRef.setInput('reservation', reservation(status));
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RequestCard],
      providers: [provideTranslateService()],
    }).compileComponents(),
  );

  it('should show the amount the owner will receive', async () => {
    await create('requested');
    expect(fixture.nativeElement.textContent).toContain('S/ 18.00');
  });

  it('should offer accept and reject while the request is pending', async () => {
    await create('requested');
    const accepted: Reservation[] = [];
    const rejected: Reservation[] = [];
    fixture.componentInstance.accepted.subscribe((r) => accepted.push(r));
    fixture.componentInstance.rejected.subscribe((r) => rejected.push(r));
    const [reject, accept] = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    reject.click();
    accept.click();
    expect(rejected.length).toBe(1);
    expect(accepted.length).toBe(1);
  });

  it('should offer no actions once the request was handled', async () => {
    await create('confirmed');
    expect(fixture.nativeElement.querySelectorAll('button').length).toBe(0);
  });
});
