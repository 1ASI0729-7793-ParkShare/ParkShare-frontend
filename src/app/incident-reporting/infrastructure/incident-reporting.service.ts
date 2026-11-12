import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Incident } from '../domain/model/incident.entity';
import { IncidentsApiEndpoint } from './incidents-api-endpoint';

@Service()
export class IncidentReportingService extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly incidentsEndpoint = new IncidentsApiEndpoint(this.http);

  getIncidents = (): Observable<Incident[]> => this.incidentsEndpoint.getAll();

  createIncident = (incident: Incident): Observable<Incident> =>
    this.incidentsEndpoint.create(incident);

  updateIncident = (incident: Incident): Observable<Incident> =>
    this.incidentsEndpoint.update(incident, incident.id);
}
