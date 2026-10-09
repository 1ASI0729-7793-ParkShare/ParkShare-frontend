import { Booking } from '../domain/model/booking.entity';
import { BookingResource, BookingsResponse } from './bookings-response';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';

export class BookingAssembler
  implements BaseAssembler<Booking, BookingResource, BookingsResponse>
{
  toEntityFromResource(resource: BookingResource): Booking {
    return new Booking({
      id: resource.id,
      code: resource.code,
      parkingSpotId: resource.parkingSpotId,
      parkingSpotName: resource.parkingSpotName,
      address: resource.address,
      driverName: resource.driverName,
      driverInitials: resource.driverInitials,
      vehiclePlate: resource.vehiclePlate,
      vehicleModel: resource.vehicleModel,
      status: resource.status,
      scheduledTime: resource.scheduledTime,
      startTime: resource.startTime,
      elapsedSeconds: resource.elapsedSeconds,
      pricePerHour: resource.pricePerHour,
      totalAmount: resource.totalAmount,
      accumulatedCost: resource.accumulatedCost,
      canAction: resource.canAction,
    });
  }

  toResourceFromEntity(entity: Booking): BookingResource {
    return {
      id: entity.id,
      code: entity.code,
      parkingSpotId: entity.parkingSpotId,
      parkingSpotName: entity.parkingSpotName,
      address: entity.address,
      driverName: entity.driverName,
      driverInitials: entity.driverInitials,
      vehiclePlate: entity.vehiclePlate,
      vehicleModel: entity.vehicleModel,
      status: entity.status,
      scheduledTime: entity.scheduledTime,
      startTime: entity.startTime,
      elapsedSeconds: entity.elapsedSeconds,
      pricePerHour: entity.pricePerHour,
      totalAmount: entity.totalAmount,
      accumulatedCost: entity.accumulatedCost,
      canAction: entity.canAction,
    };
  }

  toEntitiesFromResponse(response: BookingsResponse): Booking[] {
    return (response.bookings ?? []).map((resource) => this.toEntityFromResource(resource));
  }
}
