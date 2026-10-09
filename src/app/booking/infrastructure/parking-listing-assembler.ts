import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { ParkingListing } from '../domain/model/parking-listing.entity';
import { ParkingListingResource, ParkingListingsResponse } from './parking-listings-response';

export class ParkingListingAssembler implements BaseAssembler<
  ParkingListing,
  ParkingListingResource,
  ParkingListingsResponse
> {
  toEntitiesFromResponse = (response: ParkingListingsResponse): ParkingListing[] =>
    response.parkingListings.map((resource) => this.toEntityFromResource(resource));

  toEntityFromResource = (resource: ParkingListingResource): ParkingListing =>
    new ParkingListing({
      id: resource.id,
      ownerId: resource.ownerId,
      name: resource.name,
      address: resource.address,
      district: resource.district,
      hourlyRate: resource.hourlyRate,
      covered: resource.covered,
      rating: resource.rating,
      reviewCount: resource.reviewCount,
      availability: resource.availability,
      latitude: resource.latitude,
      longitude: resource.longitude,
    });

  toResourceFromEntity = (entity: ParkingListing): ParkingListingResource => ({
    id: entity.id,
    ownerId: entity.ownerId,
    name: entity.name,
    address: entity.address,
    district: entity.district,
    hourlyRate: entity.hourlyRate,
    covered: entity.covered,
    rating: entity.rating,
    reviewCount: entity.reviewCount,
    availability: entity.availability,
    latitude: entity.latitude,
    longitude: entity.longitude,
  });
}
