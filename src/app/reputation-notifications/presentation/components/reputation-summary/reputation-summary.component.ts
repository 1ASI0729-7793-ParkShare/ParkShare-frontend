import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { UserReputation } from '../../../domain/model/user-reputation.entity';

@Component({
  selector: 'app-reputation-summary',
  standalone: true,
  imports: [DecimalPipe, TranslatePipe],
  templateUrl: './reputation-summary.component.html',
  styleUrl: './reputation-summary.component.css',
})
export class ReputationSummaryComponent {
  @Input() reputation: UserReputation | null = null;
}
