import { computed, inject, Service, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';
import { BookingStore } from '../../booking/application/booking.store';
import { CURRENT_OWNER_ID } from '../../booking/domain/model/booking-types';
import { ParkingListing } from '../../booking/domain/model/parking-listing.entity';
import { EmergencyKind, LocationSource } from '../domain/model/emergency-types';
import { EmergencyAlert } from '../domain/model/emergency-alert.entity';
import { EmergencyAlertsService } from '../infrastructure/emergency-alerts.service';


export interface EmergencyDraft {
  kind: EmergencyKind;
  notes: string;
  listing: ParkingListing | null;
  /** Device position when available; otherwise the space coordinates are used. */
  position: { latitude: number; longitude: number } | null;
}

/** Holds emergency-alert state and coordinates the SOS use cases. */
@Service()
export class EmergencyAlertsStore {
  private readonly service = inject(EmergencyAlertsService);
  private readonly bookingStore = inject(BookingStore);

  private readonly alertsSignal = signal<EmergencyAlert[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  /** Spaces of the current owner, to say where the emergency is. */
  readonly ownerListings = this.bookingStore.ownerListings;

  readonly ownerAlerts = computed(() =>
    this.alertsSignal()
      .filter((a) => a.ownerId === CURRENT_OWNER_ID)
      .sort((a, b) => Number(b.isActive) - Number(a.isActive) || b.createdAt.localeCompare(a.createdAt)),
  );
  readonly activeCount = computed(() => this.ownerAlerts().filter((a) => a.isActive).length);

  constructor() {
    this.loadAlerts();
  }

  raise = (draft: EmergencyDraft, onSuccess?: (created: EmergencyAlert) => void): void => {
    let latitude: number | null = null;
    let longitude: number | null = null;
    let locationSource: LocationSource | null = null;
    if (draft.position) {
      ({ latitude, longitude } = draft.position);
      locationSource = 'gps';
    } else if (draft.listing) {
      ({ latitude, longitude } = draft.listing);
      locationSource = 'space';
    }
    let alert: EmergencyAlert;
    try {
      alert = EmergencyAlert.raise({
        ownerId: CURRENT_OWNER_ID,
        parkingListingId: draft.listing?.id ?? null,
        spaceName: draft.listing?.name ?? '',
        kind: draft.kind,
        notes: draft.notes,
        latitude,
        longitude,
        locationSource,
      });
    } catch (err) {
      this.errorSignal.set(this.formatError(err, 'Invalid emergency alert'));
      return;
    }
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    // No retry: an SOS must never be duplicated by a re-sent POST.
    this.service.createAlert(alert).subscribe({
      next: (created) => {
        this.alertsSignal.update((all) => [...all, created]);
        this.loadingSignal.set(false);
        onSuccess?.(created);
      },
      error: (err) => this.fail(err, 'Failed to send the emergency alert'),
    });
  };

  resolve = (alert: EmergencyAlert): void => {
    let next: EmergencyAlert;
    try {
      next = alert.resolve();
    } catch (err) {
      this.errorSignal.set(this.formatError(err, 'Invalid alert transition'));
      return;
    }
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.service
      .updateAlert(next)
      .pipe(retry(2))
      .subscribe({
        next: (updated) => {
          this.alertsSignal.update((all) => all.map((a) => (a.id === updated.id ? updated : a)));
          this.loadingSignal.set(false);
        },
        error: (err) => this.fail(err, 'Failed to update the alert'),
      });
  };

  private loadAlerts = (): void => {
    this.loadingSignal.set(true);
    this.service
      .getAlerts()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (alerts) => {
          this.alertsSignal.set(alerts);
          this.loadingSignal.set(false);
        },
        error: (err) => this.fail(err, 'Failed to load emergency alerts'),
      });
  };

  private fail = (error: unknown, fallback: string): void => {
    this.errorSignal.set(this.formatError(error, fallback));
    this.loadingSignal.set(false);
  };

  private formatError = (error: unknown, fallback: string): string =>
    error instanceof Error ? error.message : fallback;
}
