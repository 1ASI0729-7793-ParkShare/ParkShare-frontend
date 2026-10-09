import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Profile } from '../domain/model/profile.entity';
import { ProfileResource, ProfilesResponse } from './profiles-response';

export class ProfileAssembler implements BaseAssembler<Profile, ProfileResource, ProfilesResponse> {
  toEntitiesFromResponse = (response: ProfilesResponse): Profile[] =>
    response.profiles.map((resource) => this.toEntityFromResource(resource));

  toEntityFromResource = (resource: ProfileResource): Profile =>
    new Profile({
      id: resource.id,
      fullName: resource.fullName,
      plate: resource.plate,
      vehicleModel: resource.vehicleModel,
      vehicleType: resource.vehicleType,
    });

  toResourceFromEntity = (entity: Profile): ProfileResource => ({
    id: entity.id,
    fullName: entity.fullName,
    plate: entity.plate,
    vehicleModel: entity.vehicleModel,
    vehicleType: entity.vehicleType,
  });
}
