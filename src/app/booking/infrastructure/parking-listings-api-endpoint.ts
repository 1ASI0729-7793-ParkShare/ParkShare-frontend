import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { ParkingListing } from '../domain/model/parking-listing.entity';
import { ParkingListingResource, ParkingListingsResponse } from './parking-listings-response';
import { ParkingListingAssembler } from './parking-listing-assembler';

export class ParkingListingsApiEndpoint extends BaseApiEndpoint<
  ParkingListing,
  ParkingListingResource,
  ParkingListingsResponse,
  ParkingListingAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderParkingListingsEndpointPath}`,
      new ParkingListingAssembler(),
    );
  }
}
