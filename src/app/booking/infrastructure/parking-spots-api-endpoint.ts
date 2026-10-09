import { HttpClient } from '@angular/common/http';
import { ParkingSpot } from '../domain/model/parking-spot.entity';
import { ParkingSpotResource, ParkingSpotsResponse } from './parking-spots-response';
import { ParkingSpotAssembler } from './parking-spot-assembler';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';

export class ParkingSpotsApiEndpoint extends BaseApiEndpoint<
  ParkingSpot,
  ParkingSpotResource,
  ParkingSpotsResponse,
  ParkingSpotAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderParkingSpotsEndpointPath}`,
      new ParkingSpotAssembler(),
    );
  }
}
