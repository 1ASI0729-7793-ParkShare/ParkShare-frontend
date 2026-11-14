import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { EmergencyAlertProps } from '../domain/model/emergency-alert.entity';

export interface EmergencyAlertResource extends BaseResource, EmergencyAlertProps {}

export interface EmergencyAlertsResponse extends BaseResponse {
  emergencyAlerts: EmergencyAlertResource[];
}
