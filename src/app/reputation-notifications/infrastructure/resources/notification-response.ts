import { BaseResource, BaseResponse } from '../../../shared/infrastructure/base-response';
import {
  NotificationRelatedEntityType,
  NotificationType,
} from '../../domain/model/reputation-types';

export interface NotificationResource extends BaseResource {
  recipientId: number;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  readAt: string | null;
  relatedEntityType: NotificationRelatedEntityType | null;
  relatedEntityId: number | null;
}

export interface NotificationsResponse extends BaseResponse {
  notifications: NotificationResource[];
}
