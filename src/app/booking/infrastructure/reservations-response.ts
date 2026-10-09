import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { ReservationStatus } from '../domain/model/booking-types';

export interface ReservationResource extends BaseResource {
  id: number;
  parkingListingId: number;
  ownerId: number;
  driverId: number;
  driverName: string;
  vehiclePlate: string;
  vehicleModel: string;
  spaceName: string;
  spaceAddress: string;
  hourlyRate: number;
  plannedEntry: string;
  plannedHours: number;
  status: ReservationStatus;
  startedAt: string | null;
  endedAt: string | null;
  totalCost: number | null;
}

export interface ReservationsResponse extends BaseResponse {
  bookings: ReservationResource[];
}
