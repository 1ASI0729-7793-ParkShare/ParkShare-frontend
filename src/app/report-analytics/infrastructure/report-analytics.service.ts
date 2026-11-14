import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { OwnerDashboard } from '../domain/model/owner-dashboard';
import { OwnerDashboardAssembler } from './owner-dashboard-assembler';
import { OwnerDashboardResource } from './owner-dashboard-response';

@Service()
export class ReportAnalyticsService extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly assembler = new OwnerDashboardAssembler();
  private readonly url = `${environment.platformProviderApiBaseUrl}${environment.platformProviderOwnerDashboardEndpointPath}`;

  getDashboard = (ownerId: number): Observable<OwnerDashboard> =>
    this.http
      .get<OwnerDashboardResource>(this.url, { params: { ownerId: String(ownerId) } })
      .pipe(map((resource) => this.assembler.toEntityFromResource(resource)));
}
