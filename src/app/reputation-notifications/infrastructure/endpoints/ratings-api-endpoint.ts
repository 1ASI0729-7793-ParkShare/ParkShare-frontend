import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BaseApiEndpoint } from '../../../shared/infrastructure/base-api-endpoint';
import { Rating } from '../../domain/model/rating.entity';
import { RatingAssembler } from '../assemblers/rating-assembler';
import { RatingResource, RatingsResponse } from '../resources/rating-response';

export class RatingsApiEndpoint extends BaseApiEndpoint<
  Rating,
  RatingResource,
  RatingsResponse,
  RatingAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderRatingsEndpointPath}`,
      new RatingAssembler(),
    );
  }
}
