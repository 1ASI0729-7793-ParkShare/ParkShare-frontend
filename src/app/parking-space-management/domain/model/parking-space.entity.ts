import { AvailabilityPeriod } from './availability-period.entity';

export type ParkingSpacePublicationStatus = 'published' | 'paused';
export const PARKING_SPACE_FEATURES = [
  'covered',
  'automaticGate',
  'security24h',
  'concierge',
  'securityCameras',
] as const;
export type ParkingSpaceFeature = (typeof PARKING_SPACE_FEATURES)[number];

export class ParkingSpace {
  constructor(
    public id: number,
    public ownerId: number,
    public address: string,
    public photos: string[],
    public hourlyRate: number,
    public availability: AvailabilityPeriod[],
    public name: string = address,
    public features: ParkingSpaceFeature[] = [],
    public publicationStatus: ParkingSpacePublicationStatus = 'published',
    public accumulatedIncome = 0,
  ) {}
}
