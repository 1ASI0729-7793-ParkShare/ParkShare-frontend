import { InjectionToken } from '@angular/core';
import { CURRENT_OWNER_ID } from '../../shared/domain/model/current-user';
import { Observable } from 'rxjs';
import { AvailabilityPeriod } from '../domain/model/availability-period.entity';
import {
  ParkingSpace,
  ParkingSpaceFeature,
  ParkingSpacePublicationStatus,
} from '../domain/model/parking-space.entity';

export interface CreateParkingSpaceCommand {
  name: string;
  address: string;
  photos: string[];
  features: ParkingSpaceFeature[];
  hourlyRate: number;
  availability: AvailabilityPeriod[];
}

export interface UpdateParkingSpaceCommand {
  address: string;
  photos: string[];
}

export abstract class ParkingSpaceRepository {
  abstract getAll(): Observable<ParkingSpace[]>;
  abstract getById(id: number): Observable<ParkingSpace>;
  abstract create(command: CreateParkingSpaceCommand): Observable<ParkingSpace>;
  abstract update(id: number, command: UpdateParkingSpaceCommand): Observable<ParkingSpace>;
  abstract updateAvailability(
    id: number,
    availability: AvailabilityPeriod[],
  ): Observable<ParkingSpace>;
  abstract updatePricing(id: number, hourlyRate: number): Observable<ParkingSpace>;
  abstract updatePublicationStatus(
    id: number,
    status: ParkingSpacePublicationStatus,
  ): Observable<ParkingSpace>;
}

/** Integration seam: Identity & Access will provide the authenticated owner's id. */
export const PARKING_SPACE_OWNER_ID = new InjectionToken<number>('PARKING_SPACE_OWNER_ID', {
  factory: () => CURRENT_OWNER_ID,
});
