import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { Rating } from '../domain/model/rating.entity';
import { UserReputation } from '../domain/model/user-reputation.entity';
import { Notification } from '../domain/model/notification.entity';

import { CreateRatingCommand } from './ports/rating.repository';
import { ReputationService } from './services/reputation.service';
import { NotificationService } from './services/notification.service';

@Injectable({ providedIn: 'root' })
export class ReputationNotificationsStore {
  private readonly reputationService = inject(ReputationService);
  private readonly notificationService = inject(NotificationService);

  private readonly ratingsSignal = signal<Rating[]>([]);
  private readonly reputationSignal = signal<UserReputation | null>(null);
  private readonly notificationsSignal = signal<Notification[]>([]);

  private readonly loadingCount = signal(0);
  private readonly errorSignal = signal<string | null>(null);

  readonly ratings = this.ratingsSignal.asReadonly();
  readonly reputation = this.reputationSignal.asReadonly();
  readonly notifications = this.notificationsSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly loading = computed(() => this.loadingCount() > 0);

  readonly unreadNotifications = computed(() =>
    this.notificationsSignal().filter((item) => !item.isRead),
  );

  readonly unreadCount = computed(() => this.unreadNotifications().length);

  private beginOperation(): void {
    this.loadingCount.update((count) => count + 1);
    this.errorSignal.set(null);
  }

  private endOperation(): void {
    this.loadingCount.update((count) => Math.max(0, count - 1));
  }

  private handleError(error: unknown): void {
    this.errorSignal.set(error instanceof Error ? error.message : 'An unexpected error occurred.');
  }

  loadRatings(userId: number): void {
    this.beginOperation();

    this.reputationService
      .getReceivedRatings(userId)
      .pipe(finalize(() => this.endOperation()))
      .subscribe({
        next: (ratings) => this.ratingsSignal.set(ratings),
        error: (error) => this.handleError(error),
      });
  }

  loadReputation(userId: number): void {
    this.beginOperation();

    this.reputationService
      .getReputation(userId)
      .pipe(finalize(() => this.endOperation()))
      .subscribe({
        next: (reputation) => this.reputationSignal.set(reputation),
        error: (error) => this.handleError(error),
      });
  }

  submitRating(command: CreateRatingCommand, onSuccess?: () => void): void {
    this.beginOperation();

    this.reputationService
      .createRating(command)
      .pipe(finalize(() => this.endOperation()))
      .subscribe({
        next: () => {
          this.loadRatings(command.revieweeId);
          this.loadReputation(command.revieweeId);
          onSuccess?.();
        },
        error: (error) => this.handleError(error),
      });
  }

  loadNotifications(recipientId: number): void {
    this.beginOperation();

    this.notificationService
      .getNotifications(recipientId)
      .pipe(finalize(() => this.endOperation()))
      .subscribe({
        next: (notifications) => this.notificationsSignal.set(notifications),
        error: (error) => this.handleError(error),
      });
  }

  markNotificationAsRead(notificationId: number, recipientId: number): void {
    this.beginOperation();

    this.notificationService
      .markAsRead(notificationId, recipientId)
      .pipe(finalize(() => this.endOperation()))
      .subscribe({
        next: (updated) => {
          this.notificationsSignal.update((items) =>
            items.map((item) => (item.id === updated.id ? updated : item)),
          );
        },
        error: (error) => this.handleError(error),
      });
  }

  clearError(): void {
    this.errorSignal.set(null);
  }
}
