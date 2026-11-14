import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BookingStore } from '../../../application/booking.store';
import { Reservation } from '../../../domain/model/reservation.entity';
import { formatClock, formatShortDate } from '../../utils/day-time';

type HistoryFilter = 'all' | 'completed' | 'rejected';

/** Driver view: every past reservation (finished or rejected) with what was paid. */
@Component({
  selector: 'app-driver-history-view',
  imports: [
    DecimalPipe,
    RouterLink,
    MatCard,
    MatCardContent,
    MatButton,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatIcon,
    TranslatePipe,
  ],
  templateUrl: './driver-history-view.html',
  styleUrl: './driver-history-view.css',
})
export class DriverHistoryView {
  protected readonly store = inject(BookingStore);
  private readonly translate = inject(TranslateService);

  protected readonly filter = signal<HistoryFilter>('all');

  protected readonly visible = computed(() => {
    const filter = this.filter();
    return this.store
      .driverHistory()
      .filter((reservation) => filter === 'all' || reservation.status === filter);
  });

  protected readonly completedCount = computed(
    () => this.store.driverHistory().filter((r) => r.status === 'completed').length,
  );
  protected readonly totalSpent = computed(() =>
    this.store
      .driverHistory()
      .filter((r) => r.status === 'completed')
      .reduce((sum, r) => sum + (r.totalCost ?? 0), 0),
  );
  protected readonly totalHours = computed(() =>
    this.store
      .driverHistory()
      .filter((r) => r.status === 'completed')
      .reduce((sum, r) => sum + this.hoursOf(r), 0),
  );

  protected setFilter(value: HistoryFilter): void {
    this.filter.set(value);
  }

  /** Date and time the stay took place (or was planned, if it never started). */
  protected whenLabel(reservation: Reservation): string {
    const lang = this.translate.currentLang() || 'en';
    const date = new Date(reservation.endedAt ?? reservation.startedAt ?? reservation.plannedEntry);
    return `${formatShortDate(date, lang)}, ${formatClock(date, lang)}`;
  }

  protected durationHours(reservation: Reservation): number {
    return this.hoursOf(reservation);
  }

  private hoursOf(reservation: Reservation): number {
    if (reservation.startedAt && reservation.endedAt) {
      const ms = new Date(reservation.endedAt).getTime() - new Date(reservation.startedAt).getTime();
      return Math.max(0, ms) / (60 * 60 * 1000);
    }
    return reservation.plannedHours;
  }
}
