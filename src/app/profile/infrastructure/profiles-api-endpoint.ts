import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { Profile } from '../domain/model/profile.entity';
import { ProfileResource, ProfilesResponse } from './profiles-response';
import { ProfileAssembler } from './profile-assembler';

export class ProfilesApiEndpoint extends BaseApiEndpoint<
  Profile,
  ProfileResource,
  ProfilesResponse,
  ProfileAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderProfilesEndpointPath}`,
      new ProfileAssembler(),
    );
  }
}
