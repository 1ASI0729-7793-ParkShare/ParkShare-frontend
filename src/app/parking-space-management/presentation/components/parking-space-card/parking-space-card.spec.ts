import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParkingSpace } from '../../../domain/model/parking-space.entity';
import { provideParkingSpaceTesting } from '../../../testing/parking-space-testing.providers';
import { ParkingSpaceCard } from './parking-space-card';

describe('ParkingSpaceCard', () => {
  let component: ParkingSpaceCard;
  let fixture: ComponentFixture<ParkingSpaceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingSpaceCard],
      providers: [...provideParkingSpaceTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ParkingSpaceCard);
    fixture.componentRef.setInput(
      'parkingSpace',
      new ParkingSpace(1, 1, 'Test address', [], 10, []),
    );
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
