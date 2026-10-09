import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { OwnerListing } from '../domain/model/owner-listing.entity';
import { OwnerListingResource, OwnerListingsResponse } from './owner-listings-response';

export class OwnerListingAssembler implements BaseAssembler<
  OwnerListing,
  OwnerListingResource,
  OwnerListingsResponse
> {
  toEntitiesFromResponse = (response: OwnerListingsResponse): OwnerListing[] =>
    response.parkingListings.map((resource) => this.toEntityFromResource(resource));

  toEntityFromResource = (resource: OwnerListingResource): OwnerListing =>
    new OwnerListing({
      id: resource.id,
      ownerId: resource.ownerId,
      name: resource.name,
      rating: resource.rating,
    });

  toResourceFromEntity = (entity: OwnerListing): OwnerListingResource => ({
    id: entity.id,
    ownerId: entity.ownerId,
    name: entity.name,
    rating: entity.rating,
  });
}
