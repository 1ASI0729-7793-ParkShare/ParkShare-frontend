import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideParkingSpaceTesting } from '../../../testing/parking-space-testing.providers';
import { ParkingSpacePricing } from './parking-space-pricing';

describe('ParkingSpacePricing', () => {
  let component: ParkingSpacePricing;
  let fixture: ComponentFixture<ParkingSpacePricing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingSpacePricing],
      providers: [...provideParkingSpaceTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ParkingSpacePricing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
