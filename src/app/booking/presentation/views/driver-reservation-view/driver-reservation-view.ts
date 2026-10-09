import { Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { map, timer } from 'rxjs';
import { BookingStore } from '../../../application/booking.store';
import { Reservation } from '../../../domain/model/reservation.entity';
import { ReservationStepper } from '../../components/reservation-stepper/reservation-stepper';
import { formatClock, formatElapsed, formatShortDate, relativeDay } from '../../utils/day-time';

const SNACKBAR_DURATION_MS = 5000;

/** Driver view: follow the active reservation, its elapsed time and accumulated cost. */
@Component({
  selector: 'app-driver-reservation-view',
  imports: [
    DecimalPipe,
    RouterLink,
    MatCard,
    MatCardContent,
    MatButton,
    MatIcon,
    MatProgressSpinner,
    ReservationStepper,
    TranslatePipe,
  ],
  templateUrl: './driver-reservation-view.html',
  styleUrl: './driver-reservation-view.css',
})
export class DriverReservationView {
  protected readonly store = inject(BookingStore);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  /** Ticks every second so the timer and cost stay live while the car is parked. */
  private readonly now = toSignal(timer(0, 1000).pipe(map(() => new Date())), {
    initialValue: new Date(),
  });

  protected readonly elapsed = computed(() => {
    const reservation = this.store.activeReservation();
    return formatElapsed(reservation ? reservation.elapsedMsAt(this.now()) : 0);
  });
  protected readonly accumulatedCost = computed(
    () => this.store.activeReservation()?.costAt(this.now()) ?? 0,
  );

  protected readonly startedLabel = computed(() => {
    const startedAt = this.store.activeReservation()?.startedAt;
    if (!startedAt) return '';
    const lang = this.translate.currentLang() || 'en';
    const started = new Date(startedAt);
    const day = relativeDay(started);
    const dayLabel = day
      ? this.translate.instant(`booking.day.${day}`).toLowerCase()
      : formatShortDate(started, lang);
    return this.translate.instant('booking.reservation.startedAt', {
      day: dayLabel,
      time: formatClock(started, lang),
    });
  });

  protected onStart(reservation: Reservation): void {
    this.store.startParking(reservation);
  }

  protected onFinish(reservation: Reservation): void {
    this.store.finishParking(reservation, (completed) =>
      this.snackBar.open(
        this.translate.instant('booking.reservation.paid', {
          amount: (completed.totalCost ?? 0).toFixed(2),
        }),
        undefined,
        { duration: SNACKBAR_DURATION_MS },
      ),
    );
  }
}
