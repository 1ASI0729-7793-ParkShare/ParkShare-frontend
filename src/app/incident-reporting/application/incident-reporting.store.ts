import { computed, inject, Service, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';
import { BookingStore } from '../../booking/application/booking.store';
import { CURRENT_OWNER_ID } from '../../booking/domain/model/booking-types';
import { ParkingListing } from '../../booking/domain/model/parking-listing.entity';
import { ProfileStore } from '../../profile/application/profile.store';
import { Incident } from '../domain/model/incident.entity';
import { IncidentType } from '../domain/model/incident-types';
import { IncidentReportingService } from '../infrastructure/incident-reporting.service';

/** What the driver fills in the report form. */
export interface IncidentDraft {
  listing: ParkingListing;
  types: IncidentType[];
  description: string;
  photos: string[];
}

/** Holds incident-reporting state and coordinates its use cases. */
@Service()
export class IncidentReportingStore {
  private readonly service = inject(IncidentReportingService);
  private readonly profileStore = inject(ProfileStore);
  private readonly bookingStore = inject(BookingStore);

  private readonly incidentsSignal = signal<Incident[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  /** Parking spaces a driver can report about. */
  readonly listings = this.bookingStore.listings;

  /** Space of the driver's open reservation, offered as the default choice. */
  readonly defaultListingId = computed(
    () => this.bookingStore.activeReservation()?.parkingListingId ?? null,
  );

  readonly myIncidents = computed(() => {
    const driverId = this.profileStore.profile()?.id;
    return this.incidentsSignal()
      .filter((i) => i.reporterId === driverId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  });

  readonly ownerIncidents = computed(() =>
    this.incidentsSignal()
      .filter((i) => i.ownerId === CURRENT_OWNER_ID)
      .sort(
        (a, b) =>
          Number(a.isResolved) - Number(b.isResolved) || b.createdAt.localeCompare(a.createdAt),
      ),
  );
  readonly pendingOwnerCount = computed(
    () => this.ownerIncidents().filter((i) => !i.isResolved).length,
  );

  constructor() {
    this.loadIncidents();
  }

  report = (draft: IncidentDraft, onSuccess?: (created: Incident) => void): void => {
    const profile = this.profileStore.profile();
    if (!profile) return;
    let incident: Incident;
    try {
      incident = Incident.report({
        reporterId: profile.id,
        reporterName: profile.fullName,
        parkingListingId: draft.listing.id,
        ownerId: draft.listing.ownerId,
        spaceName: draft.listing.name,
        spaceAddress: `${draft.listing.address}, ${draft.listing.district}`,
        types: draft.types,
        description: draft.description,
        photos: draft.photos,
      });
    } catch (err) {
      this.errorSignal.set(this.formatError(err, 'Invalid incident report'));
      return;
    }
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    // No retry: re-sending a POST could create duplicate reports.
    this.service.createIncident(incident).subscribe({
      next: (created) => {
        this.incidentsSignal.update((all) => [...all, created]);
        this.loadingSignal.set(false);
        onSuccess?.(created);
      },
      error: (err) => this.fail(err, 'Failed to send the incident report'),
    });
  };

  startReview = (incident: Incident): void => this.applyTransition(incident, (i) => i.startReview());

  resolve = (incident: Incident): void => this.applyTransition(incident, (i) => i.resolve());

  private applyTransition = (
    incident: Incident,
    transition: (incident: Incident) => Incident,
  ): void => {
    let next: Incident;
    try {
      next = transition(incident);
    } catch (err) {
      this.errorSignal.set(this.formatError(err, 'Invalid incident transition'));
      return;
    }
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.service
      .updateIncident(next)
      .pipe(retry(2))
      .subscribe({
        next: (updated) => {
          this.incidentsSignal.update((all) => all.map((i) => (i.id === updated.id ? updated : i)));
          this.loadingSignal.set(false);
        },
        error: (err) => this.fail(err, 'Failed to update the incident'),
      });
  };

  private loadIncidents = (): void => {
    this.loadingSignal.set(true);
    this.service
      .getIncidents()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (incidents) => {
          this.incidentsSignal.set(incidents);
          this.loadingSignal.set(false);
        },
        error: (err) => this.fail(err, 'Failed to load incidents'),
      });
  };

  private fail = (error: unknown, fallback: string): void => {
    this.errorSignal.set(this.formatError(error, fallback));
    this.loadingSignal.set(false);
  };

  private formatError = (error: unknown, fallback: string): string =>
    error instanceof Error ? error.message : fallback;
}
