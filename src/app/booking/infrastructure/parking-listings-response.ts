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
}

export interface ParkingListingsResponse extends BaseResponse {
  parkingListings: ParkingListingResource[];
}
