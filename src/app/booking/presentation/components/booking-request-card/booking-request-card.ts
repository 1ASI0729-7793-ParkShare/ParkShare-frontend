import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Booking } from '../../../domain/model/booking.entity';

@Component({
  selector: 'app-booking-request-card',
  imports: [TranslatePipe],
  templateUrl: './booking-request-card.html',
  styleUrl: './booking-request-card.css',
})
export class BookingRequestCard {
  readonly booking = input.required<Booking>();

  readonly accept = output<Booking>();
  readonly reject = output<Booking>();

  onAccept(): void {
    this.accept.emit(this.booking());
  }

  onReject(): void {
    this.reject.emit(this.booking());
  }
}
