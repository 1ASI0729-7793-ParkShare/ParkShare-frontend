import { WeekDay } from './dashboard-types';
import { OwnerBooking } from './owner-booking.entity';

export interface DayIncome {
  day: WeekDay;
  amount: number;
}

const round = (value: number, decimals = 2): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

/**
 * The owner's dashboard. The server calculates every figure (income, occupancy, rating…);
 * this class only holds them for the views.
 */
export class OwnerDashboard {
  constructor(
    readonly monthlyIncome: number,
    readonly monthlyChangePercent: number | null,
    readonly pendingRequests: number,
    readonly ongoingReservations: number,
    readonly publishedListings: number,
    readonly occupancyPercent: number,
    readonly averageRating: number | null,
    readonly weeklyIncome: DayIncome[],
    readonly recentActivity: OwnerBooking[],
  ) {}

  get weeklyTotal(): number {
    return round(this.weeklyIncome.reduce((sum, day) => sum + day.amount, 0));
  }

  /** Shown while the first response is on its way. */
  static empty(): OwnerDashboard {
    return new OwnerDashboard(
      0,
      null,
      0,
      0,
      0,
      0,
      null,
      (['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).map(
        (day): DayIncome => ({ day, amount: 0 }),
      ),
      [],
    );
  }
}
