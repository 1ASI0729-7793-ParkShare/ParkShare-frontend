export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_use'
  | 'completed'
  | 'cancelled';

export type ParkingSpotAvailability = 'available' | 'occupied' | 'reserved';

export interface SearchCriteria {
  district: string;
  vehicle: string;
  maxPrice: number | null;
}
