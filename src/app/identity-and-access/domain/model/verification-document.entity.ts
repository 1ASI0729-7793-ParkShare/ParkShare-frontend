import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export type DocumentVerificationStatus = 'VERIFIED' | 'UNDER_REVIEW' | 'PENDING' | 'REJECTED';

export interface VerificationDocument extends BaseEntity {
  name: string;
  status: DocumentVerificationStatus;
  statusLabel: string;
  lastUpdated: string;
}
