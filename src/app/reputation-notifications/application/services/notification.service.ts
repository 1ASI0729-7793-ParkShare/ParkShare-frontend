import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, map, switchMap, throwError } from 'rxjs';

import { Notification } from '../../domain/model/notification.entity';
import { NotificationRepository } from '../ports/notification.repository';

export const NOTIFICATION_REPOSITORY = new InjectionToken<NotificationRepository>(
  'NOTIFICATION_REPOSITORY',
);

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notifications = inject(NOTIFICATION_REPOSITORY);

  getNotifications(recipientId: number): Observable<Notification[]> {
    return this.notifications
      .findByRecipient(recipientId)
      .pipe(
        map((items) =>
          [...items].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
        ),
      );
  }

  getUnreadNotifications(recipientId: number): Observable<Notification[]> {
    return this.getNotifications(recipientId).pipe(
      map((items) => items.filter((item) => !item.isRead)),
    );
  }

  markAsRead(notificationId: number, recipientId: number): Observable<Notification> {
    return this.notifications.findById(notificationId).pipe(
      switchMap((notification) => {
        if (!notification) {
          return throwError(() => new Error('Notification not found.'));
        }

        if (notification.recipientId !== recipientId) {
          return throwError(() => new Error('Notification access denied.'));
        }

        if (notification.isRead) {
          return [notification];
        }

        notification.markAsRead();

        return this.notifications.update(notification);
      }),
    );
  }
}
