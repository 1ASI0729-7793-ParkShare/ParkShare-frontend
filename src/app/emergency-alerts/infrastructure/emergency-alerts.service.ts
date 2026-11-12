import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { EmergencyAlert } from '../domain/model/emergency-alert.entity';
import { EmergencyAlertsApiEndpoint } from './emergency-alerts-api-endpoint';

@Service()
export class EmergencyAlertsService extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly endpoint = new EmergencyAlertsApiEndpoint(this.http);

  getAlerts = (): Observable<EmergencyAlert[]> => this.endpoint.getAll();

  createAlert = (alert: EmergencyAlert): Observable<EmergencyAlert> => this.endpoint.create(alert);

  updateAlert = (alert: EmergencyAlert): Observable<EmergencyAlert> =>
    this.endpoint.update(alert, alert.id);
}
