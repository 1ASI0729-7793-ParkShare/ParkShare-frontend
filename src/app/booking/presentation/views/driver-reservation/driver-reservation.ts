import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { BookingStore } from '../../../application/booking.store';
import { Booking } from '../../../domain/model/booking.entity';
import { ReservationTracker } from '../../components/reservation-tracker/reservation-tracker';

@Component({
  selector: 'app-driver-reservation',
  imports: [RouterLink, TranslatePipe, ReservationTracker],
  templateUrl: './driver-reservation.html',
  styleUrl: './driver-reservation.css',
})
export class DriverReservation {
  protected readonly store = inject(BookingStore);

  showCheckoutModal = false;
  paidSuccess = false;

  onCheckout(reservation: Booking): void {
    this.showCheckoutModal = true;
  }

  confirmPayment(): void {
    const active = this.store.activeReservation();
    if (active) {
      this.store.checkoutAndPay(active.id, () => {
        this.paidSuccess = true;
        this.showCheckoutModal = false;
      });
    }
  }

  closeModal(): void {
    this.showCheckoutModal = false;
  }
}
