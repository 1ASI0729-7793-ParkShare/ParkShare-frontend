import { TestBed } from '@angular/core/testing';
import { ParkingSpace } from './parking-space';

describe('ParkingSpace', () => {
  let service: ParkingSpace;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParkingSpace);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
