import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParkingSpaceCard } from './parking-space-card';

describe('ParkingSpaceCard', () => {
  let component: ParkingSpaceCard;
  let fixture: ComponentFixture<ParkingSpaceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingSpaceCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ParkingSpaceCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
