import { ParkingSpotAvailability } from './booking-types';
import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class ParkingSpot implements BaseEntity {
  #id: number;
  #title: string;
  #address: string;
  #district: string;
  #pricePerHour: number;
  #rating: number;
  #reviewCount: number;
  #status: ParkingSpotAvailability;
  #isCovered: boolean;
  #mapX: number; // percentage coordinate for visual map
  #mapY: number; // percentage coordinate for visual map

  constructor(props: {
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
  }) {
    this.#id = props.id;
    this.#title = props.title;
    this.#address = props.address;
    this.#district = props.district;
    this.#pricePerHour = props.pricePerHour;
    this.#rating = props.rating;
    this.#reviewCount = props.reviewCount;
    this.#status = props.status;
    this.#isCovered = props.isCovered;
    this.#mapX = props.mapX;
    this.#mapY = props.mapY;
  }

  get id(): number {
    return this.#id;
  }
  set id(value: number) {
    this.#id = value;
  }

  get title(): string {
    return this.#title;
  }
  set title(value: string) {
    this.#title = value;
  }

  get address(): string {
    return this.#address;
  }
  set address(value: string) {
    this.#address = value;
  }

  get district(): string {
    return this.#district;
  }
  set district(value: string) {
    this.#district = value;
  }

  get pricePerHour(): number {
    return this.#pricePerHour;
  }
  set pricePerHour(value: number) {
    this.#pricePerHour = value;
  }

  get rating(): number {
    return this.#rating;
  }
  set rating(value: number) {
    this.#rating = value;
  }

  get reviewCount(): number {
    return this.#reviewCount;
  }
  set reviewCount(value: number) {
    this.#reviewCount = value;
  }

  get status(): ParkingSpotAvailability {
    return this.#status;
  }
  set status(value: ParkingSpotAvailability) {
    this.#status = value;
  }

  get isCovered(): boolean {
    return this.#isCovered;
  }
  set isCovered(value: boolean) {
    this.#isCovered = value;
  }

  get mapX(): number {
    return this.#mapX;
  }
  set mapX(value: number) {
    this.#mapX = value;
  }

  get mapY(): number {
    return this.#mapY;
  }
  set mapY(value: number) {
    this.#mapY = value;
  }
}
