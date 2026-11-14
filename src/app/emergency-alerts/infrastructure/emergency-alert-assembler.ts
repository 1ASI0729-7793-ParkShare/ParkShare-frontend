import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { EmergencyAlert } from '../domain/model/emergency-alert.entity';
import { EmergencyAlertResource, EmergencyAlertsResponse } from './emergency-alerts-response';

export class EmergencyAlertAssembler implements BaseAssembler<
  EmergencyAlert,
  EmergencyAlertResource,
  EmergencyAlertsResponse
> {
  toEntitiesFromResponse = (response: EmergencyAlertsResponse): EmergencyAlert[] =>
    response.emergencyAlerts.map((resource) => this.toEntityFromResource(resource));

  toEntityFromResource = (resource: EmergencyAlertResource): EmergencyAlert =>
    new EmergencyAlert({ ...resource });

  toResourceFromEntity = (entity: EmergencyAlert): EmergencyAlertResource => entity.toProps();
}
