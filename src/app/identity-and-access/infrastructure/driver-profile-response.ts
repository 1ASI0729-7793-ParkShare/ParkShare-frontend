import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface VehicleResource extends BaseResource {
  plate: string;
  model: string;
  vehicleType: string;
}

export interface VerificationDocumentResource extends BaseResource {
  name: string;
  status: 'VERIFIED' | 'UNDER_REVIEW' | 'PENDING' | 'REJECTED';
  statusLabel: string;
  lastUpdated: string;
}

export interface DriverProfileResource extends BaseResource {
  fullName: string;
  role: 'conductor' | 'propietario';
  isVerified: boolean;
  verificationStatusText: string;
  avatarUrl?: string;
  vehicle: VehicleResource;
  documents: VerificationDocumentResource[];
}

export interface DriverProfileResponse extends BaseResponse {
  profiles: DriverProfileResource[];
}
