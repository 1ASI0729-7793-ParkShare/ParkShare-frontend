import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {
  CreateParkingSpaceCommand,
  PARKING_SPACE_OWNER_ID,
  ParkingSpaceRepository,
  UpdateParkingSpaceCommand,
} from '../application/parking-space.repository';
import { AvailabilityPeriod } from '../domain/model/availability-period.entity';
import { ParkingSpace, ParkingSpacePublicationStatus } from '../domain/model/parking-space.entity';

@Injectable()
export class InMemoryParkingSpaceRepository extends ParkingSpaceRepository {
  private readonly ownerId = inject(PARKING_SPACE_OWNER_ID);
  private readonly parkingSpaces: ParkingSpace[] = [];
  private nextId = 1;

  override getAll(): Observable<ParkingSpace[]> {
    return of(this.parkingSpaces.map((parkingSpace) => this.clone(parkingSpace)));
  }

  override getById(id: number): Observable<ParkingSpace> {
    const parkingSpace = this.parkingSpaces.find((candidate) => candidate.id === id);
    return parkingSpace
      ? of(this.clone(parkingSpace))
      : throwError(() => new Error('Parking space not found'));
  }

  override create(command: CreateParkingSpaceCommand): Observable<ParkingSpace> {
    const parkingSpace = new ParkingSpace(
      this.nextId++,
      this.ownerId,
      command.address,
      [...command.photos],
      command.hourlyRate,
      this.cloneAvailability(command.availability),
    );
    this.parkingSpaces.push(parkingSpace);
    return of(this.clone(parkingSpace));
  }

  override update(id: number, command: UpdateParkingSpaceCommand): Observable<ParkingSpace> {
    return this.change(id, (parkingSpace) => {
      parkingSpace.address = command.address;
      parkingSpace.photos = [...command.photos];
    });
  }

  override updateAvailability(
    id: number,
    availability: AvailabilityPeriod[],
  ): Observable<ParkingSpace> {
    return this.change(id, (parkingSpace) => {
      parkingSpace.availability = this.cloneAvailability(availability);
    });
  }

  override updatePricing(id: number, hourlyRate: number): Observable<ParkingSpace> {
    return this.change(id, (parkingSpace) => {
      parkingSpace.hourlyRate = hourlyRate;
    });
  }

  override updatePublicationStatus(
    id: number,
    status: ParkingSpacePublicationStatus,
  ): Observable<ParkingSpace> {
    return this.change(id, (parkingSpace) => {
      parkingSpace.publicationStatus = status;
    });
  }

  private change(
    id: number,
    update: (parkingSpace: ParkingSpace) => void,
  ): Observable<ParkingSpace> {
    const parkingSpace = this.parkingSpaces.find((candidate) => candidate.id === id);
    if (!parkingSpace) {
      return throwError(() => new Error('Parking space not found'));
    }

    update(parkingSpace);
    return of(this.clone(parkingSpace));
  }

  private clone(parkingSpace: ParkingSpace): ParkingSpace {
    return new ParkingSpace(
      parkingSpace.id,
      parkingSpace.ownerId,
      parkingSpace.address,
      [...parkingSpace.photos],
      parkingSpace.hourlyRate,
      this.cloneAvailability(parkingSpace.availability),
      parkingSpace.name,
      [...parkingSpace.features],
      parkingSpace.publicationStatus,
      parkingSpace.accumulatedIncome,
    );
  }

  private cloneAvailability(availability: AvailabilityPeriod[]): AvailabilityPeriod[] {
    return availability.map((period) => ({ ...period }));
  }
}
