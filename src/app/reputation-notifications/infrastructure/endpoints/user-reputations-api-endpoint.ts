import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BaseApiEndpoint } from '../../../shared/infrastructure/base-api-endpoint';
import { UserReputation } from '../../domain/model/user-reputation.entity';
import { UserReputationAssembler } from '../assemblers/user-reputation-assembler';
import {
  UserReputationResource,
  UserReputationsResponse,
} from '../resources/user-reputation-response';

export class UserReputationsApiEndpoint extends BaseApiEndpoint<
  UserReputation,
  UserReputationResource,
  UserReputationsResponse,
  UserReputationAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderUserReputationsEndpointPath}`,
      new UserReputationAssembler(),
    );
  }
}
