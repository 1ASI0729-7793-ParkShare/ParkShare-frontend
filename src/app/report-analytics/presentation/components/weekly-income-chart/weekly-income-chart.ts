import { Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CURRENCY } from '../../../domain/model/dashboard-types';
import { DayIncome } from '../../../domain/model/owner-dashboard';
import { CurrencyPipe, DecimalPipe } from '@angular/common';


@Component({
  selector: 'app-weekly-income-chart',
  imports: [CurrencyPipe, TranslatePipe, DecimalPipe],
  templateUrl: './weekly-income-chart.html',
  styleUrl: './weekly-income-chart.css',
})
export class WeeklyIncomeChart {
  readonly days = input.required<DayIncome[]>();
  readonly total = input.required<number>();

  protected readonly currency = CURRENCY;
  protected readonly max = computed(() => Math.max(0, ...this.days().map((d) => d.amount)));

  protected heightOf(amount: number): number {
    const max = this.max();
    return max > 0 ? Math.max(4, (amount / max) * 100) : 4;
  }

  protected isPeak(amount: number): boolean {
    return amount > 0 && amount === this.max();
  }
}
