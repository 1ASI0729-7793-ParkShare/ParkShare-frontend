import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { VerificationDocument } from '../domain/model/verification-document.entity';
import {
  VerificationDocumentResource,
  VerificationDocumentsResponse,
} from './verification-documents-response';

export class VerificationDocumentAssembler implements BaseAssembler<
  VerificationDocument,
  VerificationDocumentResource,
  VerificationDocumentsResponse
> {
  toEntitiesFromResponse = (response: VerificationDocumentsResponse): VerificationDocument[] =>
    response.verificationDocuments.map((resource) => this.toEntityFromResource(resource));

  toEntityFromResource = (resource: VerificationDocumentResource): VerificationDocument =>
    new VerificationDocument({
      id: resource.id,
      profileId: resource.profileId,
      type: resource.type,
      status: resource.status,
      updatedAt: resource.updatedAt,
      fileName: resource.fileName,
    });

  toResourceFromEntity = (entity: VerificationDocument): VerificationDocumentResource => ({
    id: entity.id,
    profileId: entity.profileId,
    type: entity.type,
    status: entity.status,
    updatedAt: entity.updatedAt,
    fileName: entity.fileName,
  });
}
