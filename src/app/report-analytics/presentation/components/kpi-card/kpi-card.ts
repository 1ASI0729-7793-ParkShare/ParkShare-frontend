import { Component, input } from '@angular/core';

export type KpiTone = 'neutral' | 'positive' | 'negative';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
})
export class KpiCard {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly hint = input<string>('');
  readonly tone = input<KpiTone>('neutral');
}
