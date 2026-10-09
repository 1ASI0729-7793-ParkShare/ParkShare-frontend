export type ReservationStatus = 'requested' | 'confirmed' | 'in-use' | 'completed' | 'rejected';

/** Statuses in which a reservation still holds the parking space. */
export const ACTIVE_STATUSES: readonly ReservationStatus[] = ['requested', 'confirmed', 'in-use'];

/** Left-to-right steps shown in the driver's service tracker. */
export const SERVICE_STEPS: readonly ReservationStatus[] = [
  'requested',
  'confirmed',
  'in-use',
  'completed',
];

export type ListingAvailability = 'available' | 'occupied';

/** Owner whose requests are shown until authentication is available. */
export const CURRENT_OWNER_ID = 1;

/** Duration requested when a driver books from the search results. */
export const DEFAULT_RESERVATION_HOURS = 1;

export const DEFAULT_DISTRICT = 'Miraflores';
export const DEFAULT_MAX_HOURLY_RATE = 8;
export const MAX_HOURLY_RATE_OPTIONS = [4, 5, 6, 8, 10] as const;

export interface SearchCriteria {
  district: string;
  maxHourlyRate: number;
}

export const MS_PER_HOUR = 60 * 60 * 1000;
