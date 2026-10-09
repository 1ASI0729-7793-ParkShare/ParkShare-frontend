import { InjectionToken } from '@angular/core';
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

/**
 * Temporary integration seam. Identity & Access can provide the authenticated
 * owner's identifier when both bounded contexts are integrated.
 */
export const PARKING_SPACE_OWNER_ID = new InjectionToken<number>('PARKING_SPACE_OWNER_ID', {
  factory: () => 0,
});
