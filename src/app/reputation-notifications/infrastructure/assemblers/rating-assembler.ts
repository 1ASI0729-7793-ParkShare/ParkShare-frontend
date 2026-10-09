import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { Rating } from '../../domain/model/rating.entity';
import { RatingResource, RatingsResponse } from '../resources/rating-response';

export class RatingAssembler implements BaseAssembler<Rating, RatingResource, RatingsResponse> {
  toEntityFromResource(resource: RatingResource): Rating {
    return new Rating({
      id: resource.id,
      bookingId: resource.bookingId,
      reviewerId: resource.reviewerId,
      revieweeId: resource.revieweeId,
      score: resource.score,
      comment: resource.comment,
      createdAt: resource.createdAt,
    });
  }

  toResourceFromEntity(entity: Rating): RatingResource {
    return {
      id: entity.id,
      bookingId: entity.bookingId,
      reviewerId: entity.reviewerId,
      revieweeId: entity.revieweeId,
      score: entity.score,
      comment: entity.comment,
      createdAt: entity.createdAt,
    };
  }

  toEntitiesFromResponse(response: RatingsResponse): Rating[] {
    return response.ratings.map((resource) => this.toEntityFromResource(resource));
  }
}
