import { Observable } from 'rxjs';
import { Rating } from '../../domain/model/rating.entity';
import { UserReputation } from '../../domain/model/user-reputation.entity';

export interface CreateRatingCommand {
  bookingId: number;
  reviewerId: number;
  revieweeId: number;
  score: number;
  comment: string | null;
}

export interface RatingRepository {
  findByBookingAndReviewer(bookingId: number, reviewerId: number): Observable<Rating | null>;

  findByReviewee(userId: number): Observable<Rating[]>;

  create(command: CreateRatingCommand): Observable<Rating>;

  findReputationByUser(userId: number): Observable<UserReputation | null>;
}
