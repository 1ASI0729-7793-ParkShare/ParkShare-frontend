import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface OwnerListingResource extends BaseResource {
  id: number;
  ownerId: number;
  name: string;
  rating: number;
}

export interface OwnerListingsResponse extends BaseResponse {
  parkingListings: OwnerListingResource[];
}
