import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideParkingSpaceTesting } from '../../../testing/parking-space-testing.providers';
import { ParkingSpaceList } from './parking-space-list';

describe('ParkingSpaceList', () => {
  let component: ParkingSpaceList;
  let fixture: ComponentFixture<ParkingSpaceList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingSpaceList],
      providers: [...provideParkingSpaceTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ParkingSpaceList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
