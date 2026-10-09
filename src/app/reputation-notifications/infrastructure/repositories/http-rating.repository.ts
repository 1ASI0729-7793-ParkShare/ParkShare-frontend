import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { CreateRatingCommand, RatingRepository } from '../../application/ports/rating.repository';
import { Rating } from '../../domain/model/rating.entity';
import { UserReputation } from '../../domain/model/user-reputation.entity';
import { RatingsApiEndpoint } from '../endpoints/ratings-api-endpoint';
import { UserReputationsApiEndpoint } from '../endpoints/user-reputations-api-endpoint';
import { RatingResource } from '../resources/rating-response';
import { RatingAssembler } from '../assemblers/rating-assembler';

@Injectable()
export class HttpRatingRepository implements RatingRepository {
  private readonly http = inject(HttpClient);
  private readonly ratingsEndpoint = new RatingsApiEndpoint(this.http);
  private readonly reputationsEndpoint = new UserReputationsApiEndpoint(this.http);

  private readonly assembler = new RatingAssembler();

  findByBookingAndReviewer(bookingId: number, reviewerId: number): Observable<Rating | null> {
    return this.ratingsEndpoint
      .getAll()
      .pipe(
        map(
          (ratings) =>
            ratings.find(
              (rating) => rating.bookingId === bookingId && rating.reviewerId === reviewerId,
            ) ?? null,
        ),
      );
  }

  findByReviewee(userId: number): Observable<Rating[]> {
    return this.ratingsEndpoint
      .getAll()
      .pipe(map((ratings) => ratings.filter((rating) => rating.revieweeId === userId)));
  }

  create(command: CreateRatingCommand): Observable<Rating> {
    const resource: Omit<RatingResource, 'id'> = {
      bookingId: command.bookingId,
      reviewerId: command.reviewerId,
      revieweeId: command.revieweeId,
      score: command.score,
      comment: command.comment,
      createdAt: new Date().toISOString(),
    };

    // json-server assigns the resource ID.
    return this.http
      .post<RatingResource>(this.ratingsUrl, resource)
      .pipe(map((created) => this.assembler.toEntityFromResource(created)));
  }

  findReputationByUser(userId: number): Observable<UserReputation | null> {
    // Compute reputation from the authoritative ratings collection.
    // A cached reputation collection must not become stale.
    return this.findByReviewee(userId).pipe(
      map((ratings) => UserReputation.fromRatings(0, userId, ratings)),
    );
  }

  private get ratingsUrl(): string {
    // Reuse the same configured URL as the endpoint.
    return (
      `${environment.platformProviderApiBaseUrl}` +
      `${environment.platformProviderRatingsEndpointPath}`
    );
  }
}
