import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Incident } from '../domain/model/incident.entity';
import { IncidentResource, IncidentsResponse } from './incidents-response';

export class IncidentAssembler implements BaseAssembler<
  Incident,
  IncidentResource,
  IncidentsResponse
> {
  toEntitiesFromResponse = (response: IncidentsResponse): Incident[] =>
    response.incidents.map((resource) => this.toEntityFromResource(resource));

  toEntityFromResource = (resource: IncidentResource): Incident =>
    new Incident({ ...resource, photos: resource.photos ?? [], types: resource.types ?? [] });

  toResourceFromEntity = (entity: Incident): IncidentResource => entity.toProps();
}
