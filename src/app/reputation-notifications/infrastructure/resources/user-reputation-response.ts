import { BaseResource, BaseResponse } from '../../../shared/infrastructure/base-response';

export interface UserReputationResource extends BaseResource {
  userId: number;
  averageRating: number;
  totalRatings: number;
}

export interface UserReputationsResponse extends BaseResponse {
  userReputations: UserReputationResource[];
}
