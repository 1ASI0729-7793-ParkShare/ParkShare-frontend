import { BaseEntity } from '../../../shared/domain/model/base-entity';
import {
  EMERGENCY_KINDS,
  EmergencyKind,
  EmergencyStatus,
  LocationSource,
  MAX_EMERGENCY_NOTES_LENGTH,
} from './emergency-types';

export interface EmergencyAlertProps {
  id: number;
  ownerId: number;
  parkingListingId: number | null;
  spaceName: string;
  kind: EmergencyKind;
  notes: string;
  latitude: number | null;
  longitude: number | null;
  locationSource: LocationSource | null;
  status: EmergencyStatus;
  createdAt: string;
  resolvedAt: string | null;
}

export type EmergencyReport = Omit<EmergencyAlertProps, 'id' | 'status' | 'createdAt' | 'resolvedAt'>;

/** An SOS raised by a parking-space owner (fire, theft, accident…). Entities are immutable. */
export class EmergencyAlert implements BaseEntity {
  readonly #props: EmergencyAlertProps;

  constructor(props: EmergencyAlertProps) {
    this.#props = { ...props };
  }

  /** Builds a new active alert, enforcing the rules. */
  static raise(report: EmergencyReport, now: Date = new Date()): EmergencyAlert {
    if (!EMERGENCY_KINDS.includes(report.kind)) throw new Error('Unknown emergency kind');
    const notes = report.notes.trim();
    if (notes.length > MAX_EMERGENCY_NOTES_LENGTH) throw new Error('Notes are too long');
    return new EmergencyAlert({
      ...report,
      notes,
      id: 0,
      status: 'active',
      createdAt: now.toISOString(),
      resolvedAt: null,
    });
  }

  get id(): number {
    return this.#props.id;
  }
  get ownerId(): number {
    return this.#props.ownerId;
  }
  get parkingListingId(): number | null {
    return this.#props.parkingListingId;
  }
  get spaceName(): string {
    return this.#props.spaceName;
  }
  get kind(): EmergencyKind {
    return this.#props.kind;
  }
  get notes(): string {
    return this.#props.notes;
  }
  get latitude(): number | null {
    return this.#props.latitude;
  }
  get longitude(): number | null {
    return this.#props.longitude;
  }
  get locationSource(): LocationSource | null {
    return this.#props.locationSource;
  }
  get status(): EmergencyStatus {
    return this.#props.status;
  }
  get createdAt(): string {
    return this.#props.createdAt;
  }
  get resolvedAt(): string | null {
    return this.#props.resolvedAt;
  }

  get code(): string {
    return `SOS-${this.id}`;
  }
  get isActive(): boolean {
    return this.status === 'active';
  }
  get hasLocation(): boolean {
    return this.latitude !== null && this.longitude !== null;
  }

  /** Link to see the alert location on an interactive map. */
  get mapUrl(): string | null {
    return this.hasLocation
      ? `https://www.openstreetmap.org/?mlat=${this.latitude}&mlon=${this.longitude}#map=18/${this.latitude}/${this.longitude}`
      : null;
  }

  resolve(now: Date = new Date()): EmergencyAlert {
    if (!this.isActive) throw new Error(`Cannot resolve alert ${this.code} while it is ${this.status}`);
    return new EmergencyAlert({ ...this.#props, status: 'resolved', resolvedAt: now.toISOString() });
  }

  toProps(): EmergencyAlertProps {
    return { ...this.#props };
  }
}
