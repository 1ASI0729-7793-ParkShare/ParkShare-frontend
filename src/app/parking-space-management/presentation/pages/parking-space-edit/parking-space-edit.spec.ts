import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideParkingSpaceTesting } from '../../../testing/parking-space-testing.providers';
import { ParkingSpaceEdit } from './parking-space-edit';

describe('ParkingSpaceEdit', () => {
  let component: ParkingSpaceEdit;
  let fixture: ComponentFixture<ParkingSpaceEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingSpaceEdit],
      providers: [...provideParkingSpaceTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ParkingSpaceEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
