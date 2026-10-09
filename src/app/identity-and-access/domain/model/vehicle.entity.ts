import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export interface Vehicle extends BaseEntity {
  plate: string;
  model: string;
  vehicleType: string;
}
