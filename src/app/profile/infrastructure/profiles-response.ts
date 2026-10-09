import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { VehicleType } from '../domain/model/profile-types';

export interface ProfileResource extends BaseResource {
  id: number;
  fullName: string;
  plate: string;
  vehicleModel: string;
  vehicleType: VehicleType;
}

export interface ProfilesResponse extends BaseResponse {
  profiles: ProfileResource[];
}
