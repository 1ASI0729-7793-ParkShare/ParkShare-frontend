import { TestBed } from '@angular/core/testing';
import { ParkingSpaceApi } from './parking-space-api';

describe('ParkingSpaceApi', () => {
  let service: ParkingSpaceApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParkingSpaceApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
