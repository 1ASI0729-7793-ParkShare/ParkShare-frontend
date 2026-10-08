import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParkingSpaceAvailability } from './parking-space-availability';

describe('ParkingSpaceAvailability', () => {
  let component: ParkingSpaceAvailability;
  let fixture: ComponentFixture<ParkingSpaceAvailability>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingSpaceAvailability],
    }).compileComponents();

    fixture = TestBed.createComponent(ParkingSpaceAvailability);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
