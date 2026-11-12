import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { EmergencyAlert } from '../domain/model/emergency-alert.entity';
import { EmergencyAlertAssembler } from './emergency-alert-assembler';
import { EmergencyAlertResource, EmergencyAlertsResponse } from './emergency-alerts-response';

export class EmergencyAlertsApiEndpoint extends BaseApiEndpoint<
  EmergencyAlert,
  EmergencyAlertResource,
  EmergencyAlertsResponse,
  EmergencyAlertAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderEmergencyAlertsEndpointPath}`,
      new EmergencyAlertAssembler(),
    );
  }
}
