import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { DriverProfileResource, DriverProfileResponse } from './driver-profile-response';
import { DriverProfileAssembler } from './driver-profile-assembler';
import { environment } from '../../../environments/environment';
import { DriverProfile } from '../domain/model/driver-profile.entity';

export class DriverProfileApiEndpoint extends BaseApiEndpoint<
  DriverProfile,
  DriverProfileResource,
  DriverProfileResponse,
  DriverProfileAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderProfilesEndpointPath}`,
      new DriverProfileAssembler()
    );
  }
}
