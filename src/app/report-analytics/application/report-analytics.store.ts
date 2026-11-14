import { computed, DestroyRef, inject, Service, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CURRENT_OWNER_ID } from '../domain/model/dashboard-types';
import { OwnerDashboard } from '../domain/model/owner-dashboard';
import { ReportAnalyticsService } from '../infrastructure/report-analytics.service';

@Service()
export class ReportAnalyticsStore {
  private readonly service = inject(ReportAnalyticsService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly dashboardSignal = signal<OwnerDashboard>(OwnerDashboard.empty());
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly dashboard = this.dashboardSignal.asReadonly();
  readonly pendingRequests = computed(() => this.dashboard().pendingRequests);

  constructor() {
    this.load();
  }

  load = (): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.service
      .getDashboard(CURRENT_OWNER_ID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dashboard) => {
          this.dashboardSignal.set(dashboard);
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
