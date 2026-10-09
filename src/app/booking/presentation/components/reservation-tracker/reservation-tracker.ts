import { Component, computed, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Booking } from '../../../domain/model/booking.entity';

@Component({
  selector: 'app-reservation-tracker',
  imports: [TranslatePipe],
  templateUrl: './reservation-tracker.html',
  styleUrl: './reservation-tracker.css',
})
export class ReservationTracker {
  readonly reservation = input.required<Booking>();
  readonly liveSeconds = input<number>(4440);
  readonly liveCost = input<number>(11.42);

  readonly checkout = output<Booking>();

  // Format seconds to HH:MM:SS
  readonly formattedTime = computed(() => {
    const totalSecs = this.liveSeconds();
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  });

  onCheckout(): void {
    this.checkout.emit(this.reservation());
  }
}
