import { BaseEntity } from '../../../shared/domain/model/base-entity';
import {
  INCIDENT_TYPES,
  IncidentStatus,
  IncidentType,
  MAX_DESCRIPTION_LENGTH,
  MAX_INCIDENT_PHOTOS,
  MIN_DESCRIPTION_LENGTH,
} from './incident-types';

export interface IncidentProps {
  id: number;
  reporterId: number;
  reporterName: string;
  parkingListingId: number;
  ownerId: number;
  spaceName: string;
  spaceAddress: string;
  types: IncidentType[];
  description: string;
  /** Photos as data URLs (already compressed by the presentation layer). */
  photos: string[];
  status: IncidentStatus;
  createdAt: string;
  resolvedAt: string | null;
}

export type IncidentReport = Omit<IncidentProps, 'id' | 'status' | 'createdAt' | 'resolvedAt'>;

/**
 * A problem reported by a driver about a parking space (collision, theft, overcharge…).
 * Lifecycle: open → in-review → resolved. Entities are immutable.
 */
export class Incident implements BaseEntity {
  readonly #props: IncidentProps;

  constructor(props: IncidentProps) {
    this.#props = { ...props, types: [...props.types], photos: [...props.photos] };
  }

  /** Builds a new open incident, enforcing the reporting rules. */
  static report(report: IncidentReport, now: Date = new Date()): Incident {
    const types = [...new Set(report.types)].filter((t) => INCIDENT_TYPES.includes(t));
    const description = report.description.trim();
    if (types.length === 0) throw new Error('Select at least one incident type');
    if (description.length < MIN_DESCRIPTION_LENGTH || description.length > MAX_DESCRIPTION_LENGTH) {
      throw new Error('Description length is out of range');
    }
    if (report.photos.length > MAX_INCIDENT_PHOTOS) {
      throw new Error(`At most ${MAX_INCIDENT_PHOTOS} photos can be attached`);
    }
    return new Incident({
      ...report,
      types,
      description,
      id: 0,
      status: 'open',
      createdAt: now.toISOString(),
      resolvedAt: null,
    });
  }

  get id(): number {
    return this.#props.id;
  }
  get reporterId(): number {
    return this.#props.reporterId;
  }
  get reporterName(): string {
    return this.#props.reporterName;
  }
  get parkingListingId(): number {
    return this.#props.parkingListingId;
  }
  get ownerId(): number {
    return this.#props.ownerId;
  }
  get spaceName(): string {
    return this.#props.spaceName;
  }
  get spaceAddress(): string {
    return this.#props.spaceAddress;
  }
  get types(): IncidentType[] {
    return [...this.#props.types];
  }
  get description(): string {
    return this.#props.description;
  }
  get photos(): string[] {
    return [...this.#props.photos];
  }
  get status(): IncidentStatus {
    return this.#props.status;
  }
  get createdAt(): string {
    return this.#props.createdAt;
  }
  get resolvedAt(): string | null {
    return this.#props.resolvedAt;
  }

  /** Human-facing code, e.g. INC-12. */
  get code(): string {
    return `INC-${this.id}`;
  }

  get isResolved(): boolean {
    return this.status === 'resolved';
  }

  startReview(): Incident {
    this.#assertStatus('open', 'review');
    return this.#with({ status: 'in-review' });
  }

  resolve(now: Date = new Date()): Incident {
    if (this.status === 'resolved') {
      throw new Error(`Cannot resolve incident ${this.code} while it is resolved`);
    }
    return this.#with({ status: 'resolved', resolvedAt: now.toISOString() });
  }

  toProps(): IncidentProps {
    return { ...this.#props, types: [...this.#props.types], photos: [...this.#props.photos] };
  }

  #with(patch: Partial<IncidentProps>): Incident {
    return new Incident({ ...this.#props, ...patch });
  }

  #assertStatus(expected: IncidentStatus, action: string): void {
    if (this.status !== expected) {
      throw new Error(`Cannot ${action} incident ${this.code} while it is ${this.status}`);
    }
  }
}
