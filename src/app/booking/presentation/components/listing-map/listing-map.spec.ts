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
  const pins = () => Array.from(fixture.nativeElement.querySelectorAll('.pk-pin')) as HTMLElement[];

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
    fixture.detectChanges();
  });

  it('should create an interactive Leaflet map, not a static image', () => {
    expect(fixture.nativeElement.querySelector('.leaflet-container')).not.toBeNull();
  });

  it('should render one price pin per listing', () => {
    expect(pins().map((p) => p.textContent?.trim())).toEqual(['S/ 6.00', 'S/ 5.50']);
    expect(pins()[1].classList.contains('pk-pin--occupied')).toBe(true);
  });

  it('should emit the listing when its pin is clicked', () => {
    const selected: number[] = [];
    fixture.componentInstance.listingSelected.subscribe((l) => selected.push(l.id));
    pins()[1].closest<HTMLElement>('.leaflet-marker-icon')!.click();
    expect(selected).toEqual([2]);
  });

  it('should mark the highlighted listing', async () => {
    fixture.componentRef.setInput('highlightedId', 1);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(pins()[0].classList.contains('pk-pin--highlighted')).toBe(true);
  });
});

