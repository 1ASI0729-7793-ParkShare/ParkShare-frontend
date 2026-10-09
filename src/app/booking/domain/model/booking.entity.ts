import { BookingStatus } from './booking-types';
import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class Booking implements BaseEntity {
  #id: number;
  #code: string;
  #parkingSpotId: number;
  #parkingSpotName: string;
  #address: string;
  #driverName: string;
  #driverInitials: string;
  #vehiclePlate: string;
  #vehicleModel: string;
  #status: BookingStatus;
  #scheduledTime: string;
  #startTime: string;
  #elapsedSeconds: number;
  #pricePerHour: number;
  #totalAmount: number;
  #accumulatedCost: number;
  #canAction: boolean;

  constructor(props: {
    id: number;
    code: string;
    parkingSpotId: number;
    parkingSpotName: string;
    address: string;
    driverName: string;
    driverInitials: string;
    vehiclePlate: string;
    vehicleModel: string;
    status: BookingStatus;
    scheduledTime: string;
    startTime: string;
    elapsedSeconds: number;
    pricePerHour: number;
    totalAmount: number;
    accumulatedCost: number;
    canAction: boolean;
  }) {
    this.#id = props.id;
    this.#code = props.code;
    this.#parkingSpotId = props.parkingSpotId;
    this.#parkingSpotName = props.parkingSpotName;
    this.#address = props.address;
    this.#driverName = props.driverName;
    this.#driverInitials = props.driverInitials;
    this.#vehiclePlate = props.vehiclePlate;
    this.#vehicleModel = props.vehicleModel;
    this.#status = props.status;
    this.#scheduledTime = props.scheduledTime;
    this.#startTime = props.startTime;
    this.#elapsedSeconds = props.elapsedSeconds;
    this.#pricePerHour = props.pricePerHour;
    this.#totalAmount = props.totalAmount;
    this.#accumulatedCost = props.accumulatedCost;
    this.#canAction = props.canAction;
  }

  get id(): number {
    return this.#id;
  }
  set id(value: number) {
    this.#id = value;
  }

  get code(): string {
    return this.#code;
  }
  set code(value: string) {
    this.#code = value;
  }

  get parkingSpotId(): number {
    return this.#parkingSpotId;
  }
  set parkingSpotId(value: number) {
    this.#parkingSpotId = value;
  }

  get parkingSpotName(): string {
    return this.#parkingSpotName;
  }
  set parkingSpotName(value: string) {
    this.#parkingSpotName = value;
  }

  get address(): string {
    return this.#address;
  }
  set address(value: string) {
    this.#address = value;
  }

  get driverName(): string {
    return this.#driverName;
  }
  set driverName(value: string) {
    this.#driverName = value;
  }

  get driverInitials(): string {
    return this.#driverInitials;
  }
  set driverInitials(value: string) {
    this.#driverInitials = value;
  }

  get vehiclePlate(): string {
    return this.#vehiclePlate;
  }
  set vehiclePlate(value: string) {
    this.#vehiclePlate = value;
  }

  get vehicleModel(): string {
    return this.#vehicleModel;
  }
  set vehicleModel(value: string) {
    this.#vehicleModel = value;
  }

  get status(): BookingStatus {
    return this.#status;
  }
  set status(value: BookingStatus) {
    this.#status = value;
  }

  get scheduledTime(): string {
    return this.#scheduledTime;
  }
  set scheduledTime(value: string) {
    this.#scheduledTime = value;
  }

  get startTime(): string {
    return this.#startTime;
  }
  set startTime(value: string) {
    this.#startTime = value;
  }

  get elapsedSeconds(): number {
    return this.#elapsedSeconds;
  }
  set elapsedSeconds(value: number) {
    this.#elapsedSeconds = value;
  }

  get pricePerHour(): number {
    return this.#pricePerHour;
  }
  set pricePerHour(value: number) {
    this.#pricePerHour = value;
  }

  get totalAmount(): number {
    return this.#totalAmount;
  }
  set totalAmount(value: number) {
    this.#totalAmount = value;
  }

  get accumulatedCost(): number {
    return this.#accumulatedCost;
  }
  set accumulatedCost(value: number) {
    this.#accumulatedCost = value;
  }

  get canAction(): boolean {
    return this.#canAction;
  }
  set canAction(value: boolean) {
    this.#canAction = value;
  }
}
