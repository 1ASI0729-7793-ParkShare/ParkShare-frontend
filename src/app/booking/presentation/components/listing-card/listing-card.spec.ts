import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ParkingListing } from '../../../domain/model/parking-listing.entity';
import { ListingCard } from './listing-card';

const listing = new ParkingListing({
  id: 1, ownerId: 1, name: 'Estacionamiento techado Larco', address: 'Av. Larco 841',
  district: 'Miraflores', hourlyRate: 6, covered: true, rating: 4.8, reviewCount: 42,
  availability: 'available', latitude: -12.12, longitude: -77.03,
});

describe('ListingCard', () => {
  let fixture: ComponentFixture<ListingCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingCard],
      providers: [provideTranslateService()],
    }).compileComponents();
    fixture = TestBed.createComponent(ListingCard);
    fixture.componentRef.setInput('listing', listing);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should show the hourly price', () => {
    expect(fixture.nativeElement.textContent).toContain('S/ 6.00/h');
  });

  it('should emit the listing when reserve is clicked', () => {
    const emitted: ParkingListing[] = [];
    fixture.componentInstance.reserve.subscribe((l) => emitted.push(l));
    fixture.nativeElement.querySelector('button').click();
    expect(emitted).toEqual([listing]);
  });

  it('should disable reserve when the listing cannot be reserved', async () => {
    fixture.componentRef.setInput('canReserve', false);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('button').disabled).toBe(true);
  });
});
