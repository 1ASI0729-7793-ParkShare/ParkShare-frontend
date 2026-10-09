import { Component, Input, OnChanges, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ReputationNotificationsStore } from '../../../application/reputation-notification.store';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.css',
})
export class NotificationBellComponent implements OnChanges {
  readonly store = inject(ReputationNotificationsStore);

  @Input({ required: true }) recipientId!: number;

  ngOnChanges(): void {
    if (Number.isInteger(this.recipientId) && this.recipientId > 0) {
      this.store.loadNotifications(this.recipientId);
    }
  }
}
