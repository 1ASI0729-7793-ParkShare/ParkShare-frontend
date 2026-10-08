import { AvailabilityPeriod } from './availability-period.entity';

export class ParkingSpace {
  constructor(
    public id: number,
    public ownerId: number,
    public address: string,
    public photos: string[],
    public hourlyRate: number,
    public availability: AvailabilityPeriod[],
  ) {}
}
