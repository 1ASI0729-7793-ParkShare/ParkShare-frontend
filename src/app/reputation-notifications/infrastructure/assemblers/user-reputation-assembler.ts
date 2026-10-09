import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { UserReputation } from '../../domain/model/user-reputation.entity';
import {
  UserReputationResource,
  UserReputationsResponse,
} from '../resources/user-reputation-response';

export class UserReputationAssembler implements BaseAssembler<
  UserReputation,
  UserReputationResource,
  UserReputationsResponse
> {
  toEntityFromResource(resource: UserReputationResource): UserReputation {
    return new UserReputation({
      id: resource.id,
      userId: resource.userId,
      averageRating: resource.averageRating,
      totalRatings: resource.totalRatings,
    });
  }

  toResourceFromEntity(entity: UserReputation): UserReputationResource {
    return {
      id: entity.id,
      userId: entity.userId,
      averageRating: entity.averageRating,
      totalRatings: entity.totalRatings,
    };
  }

  toEntitiesFromResponse(response: UserReputationsResponse): UserReputation[] {
    return response.userReputations.map((resource) => this.toEntityFromResource(resource));
  }
}
