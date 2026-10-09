import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BookingStore } from '../../../application/booking.store';
import { Booking } from '../../../domain/model/booking.entity';
import { BookingRequestCard } from '../../components/booking-request-card/booking-request-card';

@Component({
  selector: 'app-owner-requests',
  imports: [TranslatePipe, BookingRequestCard],
  templateUrl: './owner-requests.html',
  styleUrl: './owner-requests.css',
})
export class OwnerRequests {
  protected readonly store = inject(BookingStore);

  onAccept(booking: Booking): void {
    this.store.acceptRequest(booking.id);
  }

  onReject(booking: Booking): void {
    this.store.rejectRequest(booking.id);
  }
}
