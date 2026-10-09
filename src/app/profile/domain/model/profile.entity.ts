import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { VehicleType } from './profile-types';

export class Profile implements BaseEntity {
  #id: number;
  #fullName: string;
  #plate: string;
  #vehicleModel: string;
  #vehicleType: VehicleType;

  constructor(props: {
    id: number;
    fullName: string;
    plate: string;
    vehicleModel: string;
    vehicleType: VehicleType;
  }) {
    this.#id = props.id;
    this.#fullName = props.fullName;
    this.#plate = props.plate;
    this.#vehicleModel = props.vehicleModel;
    this.#vehicleType = props.vehicleType;
  }

  get id(): number {
    return this.#id;
  }
  set id(value: number) {
    this.#id = value;
  }

  get fullName(): string {
    return this.#fullName;
  }
  set fullName(value: string) {
    this.#fullName = value;
  }

  get plate(): string {
    return this.#plate;
  }
  set plate(value: string) {
    this.#plate = value;
  }

  get vehicleModel(): string {
    return this.#vehicleModel;
  }
  set vehicleModel(value: string) {
    this.#vehicleModel = value;
  }

  get vehicleType(): VehicleType {
    return this.#vehicleType;
  }
  set vehicleType(value: VehicleType) {
    this.#vehicleType = value;
  }
}
