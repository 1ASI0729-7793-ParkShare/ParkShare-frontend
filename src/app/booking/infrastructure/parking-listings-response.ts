import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { ListingAvailability } from '../domain/model/booking-types';

export interface ParkingListingResource extends BaseResource {
  id: number;
  ownerId: number;
  name: string;
  address: string;
  district: string;
  hourlyRate: number;
  covered: boolean;
  rating: number;
  reviewCount: number;
  availability: ListingAvailability;
  latitude: number;
  longitude: number;
  /** Owner-managed fields of the same document (parking-space-management context). */
  photos?: string[];
  features?: string[];
  publicationStatus?: 'published' | 'paused';
  availabilityPeriods?: { dayOfWeek: string; startTime: string; endTime: string }[];
}

export interface ParkingListingsResponse extends BaseResponse {
  parkingListings: ParkingListingResource[];
}
