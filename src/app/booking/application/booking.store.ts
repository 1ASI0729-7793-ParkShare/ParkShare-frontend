import { computed, inject, Service, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';
import { ProfileStore } from '../../profile/application/profile.store';
import {
  CURRENT_OWNER_ID,
  DEFAULT_DISTRICT,
  DEFAULT_MAX_HOURLY_RATE,
  DEFAULT_RESERVATION_HOURS,
  ReservationStatus,
  SearchCriteria,
} from '../domain/model/booking-types';
import { ParkingListing } from '../domain/model/parking-listing.entity';
import { Reservation } from '../domain/model/reservation.entity';
import { BookingService } from '../infrastructure/booking.service';

/** Order in which the owner sees requests: what needs a decision comes first. */
const OWNER_STATUS_ORDER: readonly ReservationStatus[] = [
  'requested',
  'confirmed',
  'in-use',
  'completed',
  'rejected',
];

const normalize = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

/** Holds booking application state and coordinates the booking use cases. */
@Service()
export class BookingStore {
  private readonly bookingService = inject(BookingService);
  private readonly profileStore = inject(ProfileStore);

  private readonly listingsSignal = signal<ParkingListing[]>([]);
  private readonly reservationsSignal = signal<Reservation[]>([]);
  private readonly criteriaSignal = signal<SearchCriteria>({
    district: DEFAULT_DISTRICT,
    maxHourlyRate: DEFAULT_MAX_HOURLY_RATE,
  });
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly criteria = this.criteriaSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  /** Vehicle the driver would park, taken from the driver's profile. */
  readonly vehicle = computed(() => this.profileStore.profile());

  readonly searchResults = computed(() => {
    const { district, maxHourlyRate } = this.criteria();
    const query = normalize(district);
    return this.listingsSignal().filter(
      (listing) =>
        listing.hourlyRate <= maxHourlyRate &&
        (query === '' || normalize(`${listing.district} ${listing.address}`).includes(query)),
    );
  });

  /** The driver's reservation that is still open (requested, confirmed or in use). */
  readonly activeReservation = computed(() => {
    const driverId = this.profileStore.profile()?.id;
    return (
      this.reservationsSignal()
        .filter((r) => r.driverId === driverId && r.isActive)
        .sort((a, b) => b.id - a.id)[0] ?? null
    );
  });

  readonly ownerReservations = computed(() =>
    this.reservationsSignal()
      .filter((r) => r.ownerId === CURRENT_OWNER_ID)
      .sort(
        (a, b) =>
          OWNER_STATUS_ORDER.indexOf(a.status) - OWNER_STATUS_ORDER.indexOf(b.status) ||
          b.id - a.id,
      ),
  );
  readonly pendingRequestCount = computed(
    () => this.ownerReservations().filter((r) => r.status === 'requested').length,
  );

  constructor() {
    this.loadListings();
    this.loadReservations();
  }

  search = (criteria: SearchCriteria): void => this.criteriaSignal.set(criteria);

  /** Whether the driver can send a new request for the given listing. */
  canReserve = (listing: ParkingListing): boolean =>
    listing.isAvailable && !!this.profileStore.profile() && !this.activeReservation();

  reserve = (listing: ParkingListing, onSuccess?: (created: Reservation) => void): void => {
    const profile = this.profileStore.profile();
    if (!profile || !this.canReserve(listing)) return;
    const request = new Reservation({
      id: 0,
      parkingListingId: listing.id,
      ownerId: listing.ownerId,
      driverId: profile.id,
      driverName: profile.fullName,
      vehiclePlate: profile.plate,
      vehicleModel: profile.vehicleModel,
      spaceName: listing.name,
      spaceAddress: `${listing.address}, ${listing.district}`,
      hourlyRate: listing.hourlyRate,
      plannedEntry: new Date().toISOString(),
      plannedHours: DEFAULT_RESERVATION_HOURS,
      status: 'requested',
      startedAt: null,
      endedAt: null,
      totalCost: null,
    });
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    // No retry: re-sending a POST could create duplicate reservations.
    this.bookingService.createReservation(request).subscribe({
      next: (created) => {
        this.reservationsSignal.update((all) => [...all, created]);
        this.loadingSignal.set(false);
        onSuccess?.(created);
      },
      error: (err) => this.fail(err, 'Failed to create reservation'),
    });
  };

  acceptRequest = (reservation: Reservation): void =>
    this.applyTransition(reservation, (r) => r.accept());

  rejectRequest = (reservation: Reservation): void =>
    this.applyTransition(reservation, (r) => r.reject());

  startParking = (reservation: Reservation): void =>
    this.applyTransition(reservation, (r) => r.start(new Date()));

  /** Marks the exit; the reservation is completed with its final cost. */
  finishParking = (reservation: Reservation, onSuccess?: (completed: Reservation) => void): void =>
    this.applyTransition(reservation, (r) => r.finish(new Date()), onSuccess);

  private applyTransition = (
    reservation: Reservation,
    transition: (reservation: Reservation) => Reservation,
    onSuccess?: (updated: Reservation) => void,
  ): void => {
    let next: Reservation;
    try {
      next = transition(reservation);
    } catch (err) {
      this.errorSignal.set(this.formatError(err, 'Invalid reservation transition'));
      return;
    }
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.bookingService
      .updateReservation(next)
      .pipe(retry(2))
      .subscribe({
        next: (updated) => {
          this.reservationsSignal.update((all) =>
            all.map((r) => (r.id === updated.id ? updated : r)),
          );
          this.loadingSignal.set(false);
          onSuccess?.(updated);
        },
        error: (err) => this.fail(err, 'Failed to update reservation'),
      });
  };

  private loadListings = (): void => {
    this.bookingService
      .getParkingListings()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (listings) => this.listingsSignal.set(listings),
        error: (err) => this.fail(err, 'Failed to load parking spaces'),
      });
  };

  private loadReservations = (): void => {
    this.loadingSignal.set(true);
    this.bookingService
      .getReservations()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (reservations) => {
          this.reservationsSignal.set(reservations);
          this.loadingSignal.set(false);
        },
        error: (err) => this.fail(err, 'Failed to load reservations'),
      });
  };

  private fail = (error: unknown, fallback: string): void => {
    this.errorSignal.set(this.formatError(error, fallback));
    this.loadingSignal.set(false);
  };

  private formatError = (error: unknown, fallback: string): string =>
    error instanceof Error ? error.message : fallback;
}
