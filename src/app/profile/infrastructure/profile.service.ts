import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Profile } from '../domain/model/profile.entity';
import { VerificationDocument } from '../domain/model/verification-document.entity';
import { ProfilesApiEndpoint } from './profiles-api-endpoint';
import { VerificationDocumentsApiEndpoint } from './verification-documents-api-endpoint';

@Service()
export class ProfileService extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly profilesEndpoint = new ProfilesApiEndpoint(this.http);
  private readonly documentsEndpoint = new VerificationDocumentsApiEndpoint(this.http);

  getProfiles = (): Observable<Profile[]> => this.profilesEndpoint.getAll();

  updateProfile = (profile: Profile): Observable<Profile> =>
    this.profilesEndpoint.update(profile, profile.id);

  getVerificationDocuments = (): Observable<VerificationDocument[]> =>
    this.documentsEndpoint.getAll();

  updateVerificationDocument = (document: VerificationDocument): Observable<VerificationDocument> =>
    this.documentsEndpoint.update(document, document.id);
}
