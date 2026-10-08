import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParkingSpaceEdit } from './parking-space-edit';

describe('ParkingSpaceEdit', () => {
  let component: ParkingSpaceEdit;
  let fixture: ComponentFixture<ParkingSpaceEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingSpaceEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(ParkingSpaceEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
