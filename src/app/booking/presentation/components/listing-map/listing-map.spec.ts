import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ParkingListing } from '../../../domain/model/parking-listing.entity';
import { ListingMap } from './listing-map';

const make = (id: number, rate: number, lat: number, lng: number, availability: 'available' | 'occupied') =>
  new ParkingListing({
    id, ownerId: 1, name: `n${id}`, address: 'a', district: 'Miraflores', hourlyRate: rate,
    covered: true, rating: 4, reviewCount: 1, availability, latitude: lat, longitude: lng,
  });

describe('ListingMap', () => {
  let fixture: ComponentFixture<ListingMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingMap],
      providers: [provideTranslateService()],
    }).compileComponents();
    fixture = TestBed.createComponent(ListingMap);
    fixture.componentRef.setInput('listings', [
      make(1, 6, -12.1, -77.04, 'available'),
      make(2, 5.5, -12.2, -77.02, 'occupied'),
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should render one pin per listing with its price', () => {
    const pins = Array.from(fixture.nativeElement.querySelectorAll('.pin')) as HTMLElement[];
    expect(pins.map((p) => p.textContent?.trim())).toEqual(['S/ 6.00', 'S/ 5.50']);
    expect(pins[1].classList.contains('occupied')).toBe(true);
  });

  it('should place the northern pin above the southern one', () => {
    const [north, south] = Array.from(fixture.nativeElement.querySelectorAll('.pin')) as HTMLElement[];
    expect(parseFloat(north.style.top)).toBeLessThan(parseFloat(south.style.top));
  });
});
