import { BaseResource, BaseResponse } from '../../../shared/infrastructure/base-response';

export interface RatingResource extends BaseResource {
  bookingId: number;
  reviewerId: number;
  revieweeId: number;
  score: number;
  comment: string | null;
  createdAt: string;
}

export interface RatingsResponse extends BaseResponse {
  ratings: RatingResource[];
}
