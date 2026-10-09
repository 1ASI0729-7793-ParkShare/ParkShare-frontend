import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TranslatePipe } from '@ngx-translate/core';

import { ReputationNotificationsStore } from '../../../application/reputation-notification.store';
import { RatingScore } from '../../../domain/model/reputation-types';

@Component({
  selector: 'app-rating-form',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './rating-form.component.html',
  styleUrl: './rating-form.component.css',
})
export class RatingFormComponent {
  readonly store = inject(ReputationNotificationsStore);

  @Input({ required: true }) bookingId!: number;
  @Input({ required: true }) reviewerId!: number;
  @Input({ required: true }) revieweeId!: number;

  @Output() ratingSubmitted = new EventEmitter<void>();

  readonly scores: RatingScore[] = [1, 2, 3, 4, 5];
  readonly selectedScore = signal<RatingScore | null>(null);
  readonly submitting = signal(false);

  comment = '';

  selectScore(score: RatingScore): void {
    this.selectedScore.set(score);
  }

  submit(): void {
    const score = this.selectedScore();

    if (score === null || this.submitting()) {
      return;
    }

    this.submitting.set(true);


    this.store.submitRating(
      {
        bookingId: this.bookingId,
        reviewerId: this.reviewerId,
        revieweeId: this.revieweeId,
        score,
        comment: this.comment.trim() || null,
      },
      () => {
        this.submitting.set(false);
        this.selectedScore.set(null);
        this.comment = '';
        this.ratingSubmitted.emit();
      },
      () => {
        this.submitting.set(false);
      },
    );
  }
}
