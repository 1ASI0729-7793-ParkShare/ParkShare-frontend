import { Reservation } from '../domain/model/reservation.entity';
import { ReservationResource, ReservationsResponse } from './reservations-response';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';

export class ReservationAssembler implements BaseAssembler<
  Reservation,
  ReservationResource,
  ReservationsResponse
> {
  toEntitiesFromResponse = (response: ReservationsResponse): Reservation[] =>
    response.bookings.map((resource) => this.toEntityFromResource(resource));

  toEntityFromResource = (resource: ReservationResource): Reservation =>
    new Reservation({
      id: resource.id,
      parkingListingId: resource.parkingListingId,
      ownerId: resource.ownerId,
      driverId: resource.driverId,
      driverName: resource.driverName,
      vehiclePlate: resource.vehiclePlate,
      vehicleModel: resource.vehicleModel,
      spaceName: resource.spaceName,
      spaceAddress: resource.spaceAddress,
      hourlyRate: resource.hourlyRate,
      plannedEntry: resource.plannedEntry,
      plannedHours: resource.plannedHours,
      status: resource.status,
      startedAt: resource.startedAt,
      endedAt: resource.endedAt,
      totalCost: resource.totalCost,
    });

  toResourceFromEntity = (entity: Reservation): ReservationResource => ({
    id: entity.id,
    parkingListingId: entity.parkingListingId,
    ownerId: entity.ownerId,
    driverId: entity.driverId,
    driverName: entity.driverName,
    vehiclePlate: entity.vehiclePlate,
    vehicleModel: entity.vehicleModel,
    spaceName: entity.spaceName,
    spaceAddress: entity.spaceAddress,
    hourlyRate: entity.hourlyRate,
    plannedEntry: entity.plannedEntry,
    plannedHours: entity.plannedHours,
    status: entity.status,
    startedAt: entity.startedAt,
    endedAt: entity.endedAt,
    totalCost: entity.totalCost,
  });
}
