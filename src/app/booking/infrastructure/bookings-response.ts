import { BookingStatus } from '../domain/model/booking-types';
import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface BookingResource extends BaseResource {
  id: number;
  code: string;
  parkingSpotId: number;
  parkingSpotName: string;
  address: string;
  driverName: string;
  driverInitials: string;
  vehiclePlate: string;
  vehicleModel: string;
  status: BookingStatus;
  scheduledTime: string;
  startTime: string;
  elapsedSeconds: number;
  pricePerHour: number;
  totalAmount: number;
  accumulatedCost: number;
  canAction: boolean;
}

export interface BookingsResponse extends BaseResponse {
  bookings: BookingResource[];
}
