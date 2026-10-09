import { Observable } from 'rxjs';
import { Notification } from '../../domain/model/notification.entity';

export interface NotificationRepository {
  findByRecipient(recipientId: number): Observable<Notification[]>;

  findById(id: number): Observable<Notification | null>;

  update(notification: Notification): Observable<Notification>;
}
