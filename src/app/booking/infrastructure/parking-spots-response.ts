import { ParkingSpotAvailability } from '../domain/model/booking-types';
import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface ParkingSpotResource extends BaseResource {
  id: number;
  title: string;
  address: string;
  district: string;
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  status: ParkingSpotAvailability;
  isCovered: boolean;
  mapX: number;
  mapY: number;
}

export interface ParkingSpotsResponse extends BaseResponse {
  parkingSpots: ParkingSpotResource[];
}
