import { Observable } from 'rxjs';

export interface BookingRatingEligibility {
  bookingId: number;
  isCompleted: boolean;
  participantIds: number[];
}

export interface BookingVerificationPort {
  getRatingEligibility(bookingId: number): Observable<BookingRatingEligibility | null>;
}
