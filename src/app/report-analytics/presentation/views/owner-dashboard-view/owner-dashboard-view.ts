import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ReportAnalyticsStore } from '../../../application/report-analytics.store';
import { CURRENCY, RESPONSE_DEADLINE_MINUTES } from '../../../domain/model/dashboard-types';
import { KpiCard, KpiTone } from '../../components/kpi-card/kpi-card';
import { RecentActivity } from '../../components/recent-activity/recent-activity';
import { WeeklyIncomeChart } from '../../components/weekly-income-chart/weekly-income-chart';

@Component({
  selector: 'app-owner-dashboard-view',
  imports: [CurrencyPipe, TranslatePipe, KpiCard, WeeklyIncomeChart, RecentActivity],
  templateUrl: './owner-dashboard-view.html',
  styleUrl: './owner-dashboard-view.css',
})
export class OwnerDashboardView {
  protected readonly store = inject(ReportAnalyticsStore);
  protected readonly currency = CURRENCY;
  protected readonly responseMinutes = RESPONSE_DEADLINE_MINUTES;

  private readonly change = computed(() => this.store.dashboard().monthlyChangePercent);
  protected readonly incomeHintKey = computed(() => {
    const change = this.change();
    if (change === null) return 'reportAnalytics.kpi.income.noPrevious';
    return change >= 0 ? 'reportAnalytics.kpi.income.up' : 'reportAnalytics.kpi.income.down';
  });
  protected readonly incomeChange = computed(() => Math.abs(this.change() ?? 0));
  protected readonly incomeTone = computed<KpiTone>(() => {
    const change = this.change();
    if (change === null) return 'neutral';
    return change >= 0 ? 'positive' : 'negative';
  });
  protected readonly ratingHintKey = computed(() =>
    this.store.dashboard().averageRating === null
      ? 'reportAnalytics.kpi.occupancy.noRating'
      : 'reportAnalytics.kpi.occupancy.rating',
  );
}
