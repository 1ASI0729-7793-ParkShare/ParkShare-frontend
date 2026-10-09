import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError, throwError } from 'rxjs';

import { NotificationRepository } from '../../application/ports/notification.repository';
import { Notification } from '../../domain/model/notification.entity';
import { NotificationsApiEndpoint } from '../endpoints/notifications-api-endpoint';

@Injectable()
export class HttpNotificationRepository implements NotificationRepository {
  private readonly http = inject(HttpClient);
  private readonly endpoint = new NotificationsApiEndpoint(this.http);

  findByRecipient(recipientId: number): Observable<Notification[]> {
    return this.endpoint
      .getAll()
      .pipe(
        map((notifications) =>
          notifications.filter((notification) => notification.recipientId === recipientId),
        ),
      );
  }

  findById(id: number): Observable<Notification | null> {
    return this.endpoint.getById(id).pipe(
      catchError((error: Error) => {
        if (error.message.includes('Resource not found')) {
          return of(null);
        }
        return throwError(() => error);
      }),
    );
  }

  update(notification: Notification): Observable<Notification> {
    return this.endpoint.update(notification, notification.id);
  }
}
