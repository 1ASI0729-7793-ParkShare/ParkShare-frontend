import { AvailabilityPeriod } from './availability-period.entity';

export type ParkingSpacePublicationStatus = 'published' | 'paused';

export class ParkingSpace {
  constructor(
    public id: number,
    public ownerId: number,
    public address: string,
    public photos: string[],
    public hourlyRate: number,
    public availability: AvailabilityPeriod[],
    public name: string = address,
    public features: string[] = [],
    public publicationStatus: ParkingSpacePublicationStatus = 'published',
    public accumulatedIncome = 0,
  ) {}
}
