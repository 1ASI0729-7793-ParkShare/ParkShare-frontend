import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { IncidentProps } from '../domain/model/incident.entity';

export interface IncidentResource extends BaseResource, IncidentProps {}

export interface IncidentsResponse extends BaseResponse {
  incidents: IncidentResource[];
}
