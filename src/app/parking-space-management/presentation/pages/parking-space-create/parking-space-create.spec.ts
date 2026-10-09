import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideParkingSpaceTesting } from '../../../testing/parking-space-testing.providers';
import { ParkingSpaceCreate } from './parking-space-create';

describe('ParkingSpaceCreate', () => {
  let component: ParkingSpaceCreate;
  let fixture: ComponentFixture<ParkingSpaceCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingSpaceCreate],
      providers: [...provideParkingSpaceTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ParkingSpaceCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
