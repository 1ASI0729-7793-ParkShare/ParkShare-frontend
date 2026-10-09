import { ParkingSpot } from '../domain/model/parking-spot.entity';
import { ParkingSpotResource, ParkingSpotsResponse } from './parking-spots-response';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';

export class ParkingSpotAssembler
  implements BaseAssembler<ParkingSpot, ParkingSpotResource, ParkingSpotsResponse>
{
  toEntityFromResource(resource: ParkingSpotResource): ParkingSpot {
    return new ParkingSpot({
      id: resource.id,
      title: resource.title,
      address: resource.address,
      district: resource.district,
      pricePerHour: resource.pricePerHour,
      rating: resource.rating,
      reviewCount: resource.reviewCount,
      status: resource.status,
      isCovered: resource.isCovered,
      mapX: resource.mapX,
      mapY: resource.mapY,
    });
  }

  toResourceFromEntity(entity: ParkingSpot): ParkingSpotResource {
    return {
      id: entity.id,
      title: entity.title,
      address: entity.address,
      district: entity.district,
      pricePerHour: entity.pricePerHour,
      rating: entity.rating,
      reviewCount: entity.reviewCount,
      status: entity.status,
      isCovered: entity.isCovered,
      mapX: entity.mapX,
      mapY: entity.mapY,
    };
  }

  toEntitiesFromResponse(response: ParkingSpotsResponse): ParkingSpot[] {
    return (response.parkingSpots ?? []).map((resource) => this.toEntityFromResource(resource));
  }
}
