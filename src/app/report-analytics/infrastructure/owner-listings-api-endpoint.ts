import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { OwnerListing } from '../domain/model/owner-listing.entity';
import { OwnerListingAssembler } from './owner-listings-assembler';
import { OwnerListingResource, OwnerListingsResponse } from './owner-listings-response';

export class OwnerListingsApiEndpoint extends BaseApiEndpoint<
  OwnerListing,
  OwnerListingResource,
  OwnerListingsResponse,
  OwnerListingAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderParkingListingsEndpointPath}`,
      new OwnerListingAssembler(),
    );
  }
}
