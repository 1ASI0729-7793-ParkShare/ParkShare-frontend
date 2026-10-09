import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { Notification } from '../../domain/model/notification.entity';
import { NotificationResource, NotificationsResponse } from '../resources/notification-response';

export class NotificationAssembler implements BaseAssembler<
  Notification,
  NotificationResource,
  NotificationsResponse
> {
  toEntityFromResource(resource: NotificationResource): Notification {
    return new Notification({
      id: resource.id,
      recipientId: resource.recipientId,
      type: resource.type,
      title: resource.title,
      message: resource.message,
      createdAt: resource.createdAt,
      readAt: resource.readAt,
      relatedEntityType: resource.relatedEntityType,
      relatedEntityId: resource.relatedEntityId,
    });
  }

  toResourceFromEntity(entity: Notification): NotificationResource {
    return {
      id: entity.id,
      recipientId: entity.recipientId,
      type: entity.type,
      title: entity.title,
      message: entity.message,
      createdAt: entity.createdAt,
      readAt: entity.readAt,
      relatedEntityType: entity.relatedEntityType,
      relatedEntityId: entity.relatedEntityId,
    };
  }

  toEntitiesFromResponse(response: NotificationsResponse): Notification[] {
    return response.notifications.map((resource) => this.toEntityFromResource(resource));
  }
}
