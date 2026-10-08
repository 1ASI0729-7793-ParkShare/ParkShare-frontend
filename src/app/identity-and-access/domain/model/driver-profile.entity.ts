
import { VerificationDocument } from './verification-document.entity';
import { BaseEntity } from '../../../shared/infrastructure/base-entity';
import { Vehicle } from './vehicle.entity';

export interface DriverProfile extends BaseEntity {
  fullName: string;
  role: 'conductor' | 'propietario';
  isVerified: boolean;
  verificationStatusText: string;
  avatarUrl?: string;
  vehicle: Vehicle;
  documents: VerificationDocument[];
}
