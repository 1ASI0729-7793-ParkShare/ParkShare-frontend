import { Component, OnChanges, Input, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import { ReputationNotificationsStore } from '../../../application/reputation-notification.store';
import { ReputationSummaryComponent } from '../../components/reputation-summary/reputation-summary.component';

@Component({
  selector: 'app-reputation-page',
  standalone: true,
  imports: [DatePipe, TranslatePipe, ReputationSummaryComponent],
  templateUrl: './reputation-page.component.html',
  styleUrl: './reputation-page.component.css',
})
export class ReputationPageComponent implements OnChanges {
  readonly store = inject(ReputationNotificationsStore);

  @Input({ required: true }) userId!: number;

  ngOnChanges(): void {
    if (Number.isInteger(this.userId) && this.userId > 0) {
      this.store.loadRatings(this.userId);
      this.store.loadReputation(this.userId);
    }
  }
}
