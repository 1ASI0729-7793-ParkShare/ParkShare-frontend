import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { DriverProfile } from '../domain/model/driver-profile.entity';
import { Vehicle } from '../domain/model/vehicle.entity';
import { VerificationDocument } from '../domain/model/verification-document.entity';
import {
  DriverProfileResource,
  DriverProfileResponse,
  VehicleResource,
  VerificationDocumentResource,
} from './driver-profile-response';


export class DriverProfileAssembler
  implements BaseAssembler<DriverProfile, DriverProfileResource, DriverProfileResponse>
{
  toEntityFromResource(resource: DriverProfileResource): DriverProfile {
    return {
      id: resource.id,
      fullName: resource.fullName,
      role: resource.role,
      isVerified: resource.isVerified,
      verificationStatusText: resource.verificationStatusText,
      avatarUrl: resource.avatarUrl,
      vehicle: this.toVehicleEntity(resource.vehicle),
      documents: (resource.documents || []).map((doc) => this.toDocumentEntity(doc)),
    };
  }

  toResourceFromEntity(entity: DriverProfile): DriverProfileResource {
    return {
      id: entity.id,
      fullName: entity.fullName,
      role: entity.role,
      isVerified: entity.isVerified,
      verificationStatusText: entity.verificationStatusText,
      avatarUrl: entity.avatarUrl,
      vehicle: this.toVehicleResource(entity.vehicle),
      documents: (entity.documents || []).map((doc) => this.toDocumentResource(doc)),
    };
  }

  toEntitiesFromResponse(response: DriverProfileResponse): DriverProfile[] {
    if (!response || !response.profiles) return [];
    return response.profiles.map((res) => this.toEntityFromResource(res));
  }

  private toVehicleEntity(resource: VehicleResource): Vehicle {
    if (!resource) {
      return { id: 0, plate: '', model: '', vehicleType: '' };
    }
    return {
      id: resource.id,
      plate: resource.plate,
      model: resource.model,
      vehicleType: resource.vehicleType,
    };
  }

  private toVehicleResource(entity: Vehicle): VehicleResource {
    return {
      id: entity.id,
      plate: entity.plate,
      model: entity.model,
      vehicleType: entity.vehicleType,
    };
  }

  private toDocumentEntity(resource: VerificationDocumentResource): VerificationDocument {
    return {
      id: resource.id,
      name: resource.name,
      status: resource.status,
      statusLabel: resource.statusLabel,
      lastUpdated: resource.lastUpdated,
    };
  }

  private toDocumentResource(entity: VerificationDocument): VerificationDocumentResource {
    return {
      id: entity.id,
      name: entity.name,
      status: entity.status,
      statusLabel: entity.statusLabel,
      lastUpdated: entity.lastUpdated,
    };
  }
}
