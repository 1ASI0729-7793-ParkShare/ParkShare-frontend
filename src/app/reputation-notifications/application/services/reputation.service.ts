import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, switchMap, throwError, map } from 'rxjs';

import { Rating } from '../../domain/model/rating.entity';
import { UserReputation } from '../../domain/model/user-reputation.entity';
import { CreateRatingCommand, RatingRepository } from '../ports/rating.repository';
import { BookingVerificationPort } from '../ports/booking-verification.port';

export const RATING_REPOSITORY = new InjectionToken<RatingRepository>('RATING_REPOSITORY');

export const BOOKING_VERIFICATION = new InjectionToken<BookingVerificationPort>(
  'BOOKING_VERIFICATION',
);

@Injectable({ providedIn: 'root' })
export class ReputationService {
  private readonly ratings = inject(RATING_REPOSITORY);
  private readonly bookings = inject(BOOKING_VERIFICATION);

  createRating(command: CreateRatingCommand): Observable<Rating> {
    if (!Number.isInteger(command.score) || command.score < 1 || command.score > 5) {
      return throwError(() => new Error('Rating score must be between 1 and 5.'));
    }

    if (command.reviewerId === command.revieweeId) {
      return throwError(() => new Error('Users cannot rate themselves.'));
    }

    return this.bookings.getRatingEligibility(command.bookingId).pipe(
      switchMap((booking) => {
        if (!booking) {
          return throwError(() => new Error('Booking not found.'));
        }

        if (!booking.isCompleted) {
          return throwError(() => new Error('Only completed bookings can be rated.'));
        }

        const participants = booking.participantIds;

        if (
          !participants.includes(command.reviewerId) ||
          !participants.includes(command.revieweeId)
        ) {
          return throwError(() => new Error('Users must belong to the booking.'));
        }

        return this.ratings.findByBookingAndReviewer(command.bookingId, command.reviewerId);
      }),
      switchMap((existingRating) => {
        if (existingRating) {
          return throwError(() => new Error('This booking has already been rated.'));
        }

        return this.ratings.create(command);
      }),
    );
  }

  getReceivedRatings(userId: number): Observable<Rating[]> {
    return this.ratings.findByReviewee(userId);
  }

  getReputation(userId: number): Observable<UserReputation> {
    return this.ratings.findReputationByUser(userId).pipe(
      switchMap((reputation) => {
        if (reputation) {
          return [reputation];
        }

        return this.ratings
          .findByReviewee(userId)
          .pipe(map((ratings) => UserReputation.fromRatings(0, userId, ratings)));
      }),
    );
  }
}
