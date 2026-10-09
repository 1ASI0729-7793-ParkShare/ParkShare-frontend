import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { ACTIVE_STATUSES, MS_PER_HOUR, ReservationStatus } from './booking-types';

const roundMoney = (value: number): number => Math.round(value * 100) / 100;

export interface ReservationProps {
  id: number;
  parkingListingId: number;
  ownerId: number;
  driverId: number;
  driverName: string;
  vehiclePlate: string;
  vehicleModel: string;
  spaceName: string;
  spaceAddress: string;
  hourlyRate: number;
  plannedEntry: string;
  plannedHours: number;
  status: ReservationStatus;
  startedAt: string | null;
  endedAt: string | null;
  totalCost: number | null;
}

/**
 * A driver's booking of a parking space. Lifecycle:
 * requested → confirmed → in-use → completed, or requested → rejected.
 * Entities are immutable: each transition returns a new reservation.
 */
export class Reservation implements BaseEntity {
  readonly #props: ReservationProps;

  constructor(props: ReservationProps) {
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
  get driverId(): number {
    return this.#props.driverId;
  }
  get driverName(): string {
    return this.#props.driverName;
  }
  get vehiclePlate(): string {
    return this.#props.vehiclePlate;
  }
  get vehicleModel(): string {
    return this.#props.vehicleModel;
  }
  get spaceName(): string {
    return this.#props.spaceName;
  }
  get spaceAddress(): string {
    return this.#props.spaceAddress;
  }
  get hourlyRate(): number {
    return this.#props.hourlyRate;
  }
  get plannedEntry(): string {
    return this.#props.plannedEntry;
  }
  get plannedHours(): number {
    return this.#props.plannedHours;
  }
  get status(): ReservationStatus {
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

  /** Human-facing code, e.g. R-2039. */
  get code(): string {
    return `R-${this.id}`;
  }

  get isActive(): boolean {
    return ACTIVE_STATUSES.includes(this.status);
  }

  /** What the owner expects to receive for the planned duration. */
  get estimatedAmount(): number {
    return roundMoney(this.hourlyRate * this.plannedHours);
  }

  /** Milliseconds parked as of `now` (frozen at the exit time once finished). */
  elapsedMsAt(now: Date): number {
    if (!this.startedAt) return 0;
    const end = this.endedAt ? new Date(this.endedAt) : now;
    return Math.max(0, end.getTime() - new Date(this.startedAt).getTime());
  }

  /** Cost accumulated as of `now`, charged proportionally to the time parked. */
  costAt(now: Date): number {
    return roundMoney((this.elapsedMsAt(now) / MS_PER_HOUR) * this.hourlyRate);
  }

  accept(): Reservation {
    this.#assertStatus('requested', 'accept');
    return this.#with({ status: 'confirmed' });
  }

  reject(): Reservation {
    this.#assertStatus('requested', 'reject');
    return this.#with({ status: 'rejected' });
  }

  /** The driver arrives and the meter starts. */
  start(now: Date): Reservation {
    this.#assertStatus('confirmed', 'start');
    return this.#with({ status: 'in-use', startedAt: now.toISOString() });
  }

  /** The driver leaves; the final cost is fixed at this moment. */
  finish(now: Date): Reservation {
    this.#assertStatus('in-use', 'finish');
    const finished = this.#with({ endedAt: now.toISOString() });
    return finished.#with({ status: 'completed', totalCost: finished.costAt(now) });
  }

  #with(patch: Partial<ReservationProps>): Reservation {
    return new Reservation({ ...this.#props, ...patch });
  }

  #assertStatus(expected: ReservationStatus, action: string): void {
    if (this.status !== expected) {
      throw new Error(`Cannot ${action} reservation ${this.code} while it is ${this.status}`);
    }
  }
}
