import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { ListingAvailability } from './booking-types';

/** A parking space as offered to drivers searching for a place to park. */
export class ParkingListing implements BaseEntity {
  #id: number;
  #ownerId: number;
  #name: string;
  #address: string;
  #district: string;
  #hourlyRate: number;
  #covered: boolean;
  #rating: number;
  #reviewCount: number;
  #availability: ListingAvailability;
  #latitude: number;
  #longitude: number;

  constructor(props: {
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
  }) {
    this.#id = props.id;
    this.#ownerId = props.ownerId;
    this.#name = props.name;
    this.#address = props.address;
    this.#district = props.district;
    this.#hourlyRate = props.hourlyRate;
    this.#covered = props.covered;
    this.#rating = props.rating;
    this.#reviewCount = props.reviewCount;
    this.#availability = props.availability;
    this.#latitude = props.latitude;
    this.#longitude = props.longitude;
  }

  get id(): number {
    return this.#id;
  }
  get ownerId(): number {
    return this.#ownerId;
  }
  get name(): string {
    return this.#name;
  }
  get address(): string {
    return this.#address;
  }
  get district(): string {
    return this.#district;
  }
  get hourlyRate(): number {
    return this.#hourlyRate;
  }
  get covered(): boolean {
    return this.#covered;
  }
  get rating(): number {
    return this.#rating;
  }
  get reviewCount(): number {
    return this.#reviewCount;
  }
  get availability(): ListingAvailability {
    return this.#availability;
  }
  get latitude(): number {
    return this.#latitude;
  }
  get longitude(): number {
    return this.#longitude;
  }

  get isAvailable(): boolean {
    return this.#availability === 'available';
  }
}
