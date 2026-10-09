import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {
  CreateParkingSpaceCommand,
  PARKING_SPACE_OWNER_ID,
  ParkingSpaceRepository,
  UpdateParkingSpaceCommand,
} from '../application/parking-space.repository';
import { AvailabilityPeriod } from '../domain/model/availability-period.entity';
import { ParkingSpace, ParkingSpacePublicationStatus } from '../domain/model/parking-space.entity';

export const PARKING_SPACE_DEMO_DATA = new InjectionToken<boolean>('PARKING_SPACE_DEMO_DATA', {
  factory: () => false,
});

@Injectable()
export class InMemoryParkingSpaceRepository extends ParkingSpaceRepository {
  private readonly ownerId = inject(PARKING_SPACE_OWNER_ID);
  private readonly demoDataEnabled = inject(PARKING_SPACE_DEMO_DATA);
  private readonly parkingSpaces: ParkingSpace[] = this.demoDataEnabled
    ? this.createDemoData()
    : [];
  private nextId = this.parkingSpaces.length + 1;

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

  private createDemoData(): ParkingSpace[] {
    return [
      new ParkingSpace(
        1,
        this.ownerId,
        'Av. Larco 841, Miraflores',
        [],
        6,
        this.createAvailability(
          ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          '00:00',
          '23:59',
        ),
        'Estacionamiento techado Larco',
        ['Techada', 'Portón automático', 'Vigilancia 24/7'],
        'published',
        1480,
      ),
      new ParkingSpace(
        2,
        this.ownerId,
        'Av. Alfredo Benavides 1220, Miraflores',
        [],
        5.5,
        this.createAvailability(
          ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          '08:00',
          '20:00',
        ),
        'Cochera Residencial Benavides',
        ['Techada', 'Conserjería'],
        'published',
        840.5,
      ),
      new ParkingSpace(
        3,
        this.ownerId,
        'Calle Diagonal 340, Miraflores',
        [],
        7,
        this.createAvailability(['saturday', 'sunday'], '09:00', '23:00'),
        'Estacionamiento Seguro Diagonal',
        ['Cámaras de seguridad'],
        'paused',
        310,
      ),
    ];
  }

  private createAvailability(
    days: string[],
    startTime: string,
    endTime: string,
  ): AvailabilityPeriod[] {
    return days.map((dayOfWeek) => ({ dayOfWeek, startTime, endTime }));
  }

  private cloneAvailability(availability: AvailabilityPeriod[]): AvailabilityPeriod[] {
    return availability.map((period) => ({ ...period }));
  }
}
