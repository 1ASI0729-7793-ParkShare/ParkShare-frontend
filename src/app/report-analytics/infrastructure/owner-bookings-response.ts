import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { BookingStatus } from '../domain/model/dashboard-types';

export interface OwnerBookingResource extends BaseResource {
  id: number;
  parkingListingId: number;
  ownerId: number;
  driverName: string;
  spaceName: string;
  plannedEntry: string;
  status: BookingStatus;
  startedAt: string | null;
  endedAt: string | null;
  totalCost: number | null;
}

export interface OwnerBookingsResponse extends BaseResponse {
  bookings: OwnerBookingResource[];
}
