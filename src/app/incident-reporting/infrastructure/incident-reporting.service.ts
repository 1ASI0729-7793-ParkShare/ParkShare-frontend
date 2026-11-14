import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { FileUploadService } from '../../shared/infrastructure/file-upload.service';
import { Incident } from '../domain/model/incident.entity';
import { IncidentsApiEndpoint } from './incidents-api-endpoint';

@Service()
export class IncidentReportingService extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly incidentsEndpoint = new IncidentsApiEndpoint(this.http);
  private readonly uploads = inject(FileUploadService);

  getIncidents = (): Observable<Incident[]> => this.incidentsEndpoint.getAll();

  /** Photos are uploaded first; the incident stores their URLs instead of the image data. */
  createIncident = (incident: Incident): Observable<Incident> =>
    this.uploads
      .resolvePhotos(incident.photos)
      .pipe(
        switchMap((photos) =>
          this.incidentsEndpoint.create(new Incident({ ...incident.toProps(), photos })),
        ),
      );

  updateIncident = (incident: Incident): Observable<Incident> =>
    this.incidentsEndpoint.update(incident, incident.id);
}
