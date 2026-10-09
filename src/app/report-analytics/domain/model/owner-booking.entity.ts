import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { BookingStatus } from './dashboard-types';

export interface OwnerBookingProps {
  id: number;
  parkingListingId: number;
  ownerId: number;
  driverName: string;
  spaceName: string;
  plannedEntry: string;
  status: BookingStatus;
  startedAt: string | null;
  endedAt: string | null;
  totalCost: number | null;
}

export class OwnerBooking implements BaseEntity {
  readonly #props: OwnerBookingProps;

  constructor(props: OwnerBookingProps) {
    this.#props = { ...props };
  }

  get id(): number {
    return this.#props.id;
  }
  get parkingListingId(): number {
    return this.#props.parkingListingId;
  }
  get ownerId(): number {
    return this.#props.ownerId;
  }
  get driverName(): string {
    return this.#props.driverName;
  }
  get spaceName(): string {
    return this.#props.spaceName;
  }
  get plannedEntry(): string {
    return this.#props.plannedEntry;
  }
  get status(): BookingStatus {
    return this.#props.status;
  }
  get startedAt(): string | null {
    return this.#props.startedAt;
  }
  get endedAt(): string | null {
    return this.#props.endedAt;
  }
  get totalCost(): number | null {
    return this.#props.totalCost;
  }

  get occurredAt(): Date {
    return new Date(this.endedAt ?? this.startedAt ?? this.plannedEntry);
  }

  get earnedAmount(): number {
    return this.status === 'completed' ? (this.totalCost ?? 0) : 0;
  }

  get isPending(): boolean {
    return this.status === 'requested';
  }
  get isOngoing(): boolean {
    return this.status === 'in-use';
  }
}
