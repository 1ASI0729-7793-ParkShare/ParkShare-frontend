import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { OwnerBooking } from '../domain/model/owner-booking.entity';
import { OwnerBookingResource, OwnerBookingsResponse } from './owner-bookings-response';

export class OwnerBookingAssembler implements BaseAssembler<
  OwnerBooking,
  OwnerBookingResource,
  OwnerBookingsResponse
> {
  toEntitiesFromResponse = (response: OwnerBookingsResponse): OwnerBooking[] =>
    response.bookings.map((resource) => this.toEntityFromResource(resource));

  toEntityFromResource = (resource: OwnerBookingResource): OwnerBooking =>
    new OwnerBooking({
      id: resource.id,
      parkingListingId: resource.parkingListingId,
      ownerId: resource.ownerId,
      driverName: resource.driverName,
      spaceName: resource.spaceName,
      plannedEntry: resource.plannedEntry,
      status: resource.status,
      startedAt: resource.startedAt ?? null,
      endedAt: resource.endedAt ?? null,
      totalCost: resource.totalCost ?? null,
    });

  toResourceFromEntity = (entity: OwnerBooking): OwnerBookingResource => ({
    id: entity.id,
    parkingListingId: entity.parkingListingId,
    ownerId: entity.ownerId,
    driverName: entity.driverName,
    spaceName: entity.spaceName,
    plannedEntry: entity.plannedEntry,
    status: entity.status,
    startedAt: entity.startedAt,
    endedAt: entity.endedAt,
    totalCost: entity.totalCost,
  });
}
