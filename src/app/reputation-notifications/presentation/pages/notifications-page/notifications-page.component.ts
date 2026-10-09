import { Component, Input, OnChanges, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import { ReputationNotificationsStore } from '../../../application/reputation-notification.store';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [DatePipe, TranslatePipe],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.css',
})
export class NotificationsPageComponent implements OnChanges {
  readonly store = inject(ReputationNotificationsStore);

  @Input({ required: true }) recipientId!: number;

  ngOnChanges(): void {
    if (Number.isInteger(this.recipientId) && this.recipientId > 0) {
      this.store.loadNotifications(this.recipientId);
    }
  }

  markAsRead(notificationId: number): void {
    this.store.markNotificationAsRead(notificationId, this.recipientId);
  }
}
