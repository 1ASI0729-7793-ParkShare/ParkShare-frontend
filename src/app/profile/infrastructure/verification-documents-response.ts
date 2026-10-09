import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { DocumentStatus, DocumentType } from '../domain/model/profile-types';

export interface VerificationDocumentResource extends BaseResource {
  id: number;
  profileId: number;
  type: DocumentType;
  status: DocumentStatus;
  updatedAt: string;
  fileName: string | null;
}

export interface VerificationDocumentsResponse extends BaseResponse {
  verificationDocuments: VerificationDocumentResource[];
}
