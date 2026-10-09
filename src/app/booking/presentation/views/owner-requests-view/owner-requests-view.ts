import { Component, inject } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { BookingStore } from '../../../application/booking.store';
import { Reservation } from '../../../domain/model/reservation.entity';
import { RequestCard } from '../../components/request-card/request-card';

/** Owner view: reservation requests from drivers waiting for an answer. */
@Component({
  selector: 'app-owner-requests-view',
  imports: [RequestCard, MatProgressSpinner, TranslatePipe],
  templateUrl: './owner-requests-view.html',
  styleUrl: './owner-requests-view.css',
})
export class OwnerRequestsView {
  protected readonly store = inject(BookingStore);

  protected onAccepted(reservation: Reservation): void {
    this.store.acceptRequest(reservation);
  }

  protected onRejected(reservation: Reservation): void {
    this.store.rejectRequest(reservation);
  }
}
