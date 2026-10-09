import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  BookingRatingEligibility,
  BookingVerificationPort,
} from '../../application/ports/booking-verification.port';

interface BookingResource {
  id: number;
  driverId: number;
  ownerId: number;
  status: string;
}

@Injectable()
export class HttpBookingVerificationAdapter implements BookingVerificationPort {
  private readonly http = inject(HttpClient);

  private readonly endpointUrl =
    `${environment.platformProviderApiBaseUrl}` +
    `${environment.platformProviderBookingsEndpointPath}`;

  getRatingEligibility(bookingId: number): Observable<BookingRatingEligibility | null> {
    return this.http.get<BookingResource>(`${this.endpointUrl}/${bookingId}`).pipe(
      map((booking) => ({
        bookingId: booking.id,
        isCompleted: booking.status === 'completed',
        participantIds: [booking.driverId, booking.ownerId],
      })),
      catchError((error) => {
        if (error.status === 404) {
          return of(null);
        }
        return throwError(() => error);
      }),
    );
  }
}
