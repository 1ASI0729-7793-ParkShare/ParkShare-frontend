import { computed, DestroyRef, inject, Service, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { CURRENT_OWNER_ID } from '../domain/model/dashboard-types';
import { OwnerBooking } from '../domain/model/owner-booking.entity';
import { OwnerDashboard } from '../domain/model/owner-dashboard';
import { OwnerListing } from '../domain/model/owner-listing.entity';
import { ReportAnalyticsService } from '../infrastructure/report-analytics.service';

@Service()
export class ReportAnalyticsStore {
  private readonly service = inject(ReportAnalyticsService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly bookingsSignal = signal<OwnerBooking[]>([]);
  private readonly listingsSignal = signal<OwnerListing[]>([]);
  private readonly nowSignal = signal<Date>(new Date());
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly dashboard = computed(() =>
    OwnerDashboard.from(
      this.bookingsSignal().filter((b) => b.ownerId === CURRENT_OWNER_ID),
      this.listingsSignal().filter((l) => l.ownerId === CURRENT_OWNER_ID),
      this.nowSignal(),
    ),
  );
  readonly pendingRequests = computed(() => this.dashboard().pendingRequests);

  constructor() {
    this.load();
  }

  load = (): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    forkJoin({ bookings: this.service.getBookings(), listings: this.service.getListings() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ bookings, listings }) => {
          this.bookingsSignal.set(bookings);
          this.listingsSignal.set(listings);
          this.nowSignal.set(new Date());
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load dashboard'));
          this.loadingSignal.set(false);
        },
      });
  };

  private formatError(error: unknown, fallback: string): string {
    return error instanceof Error
      ? error.message.includes('Not Found')
        ? `${fallback}: not found`
        : error.message
      : fallback;
  }
}
