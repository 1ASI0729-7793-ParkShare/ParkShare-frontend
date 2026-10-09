import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { VerificationDocument } from '../domain/model/verification-document.entity';
import {
  VerificationDocumentResource,
  VerificationDocumentsResponse,
} from './verification-documents-response';
import { VerificationDocumentAssembler } from './verification-document-assembler';

export class VerificationDocumentsApiEndpoint extends BaseApiEndpoint<
  VerificationDocument,
  VerificationDocumentResource,
  VerificationDocumentsResponse,
  VerificationDocumentAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderVerificationDocumentsEndpointPath}`,
      new VerificationDocumentAssembler(),
    );
  }
}
