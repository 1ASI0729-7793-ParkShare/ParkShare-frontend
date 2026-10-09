import { RECENT_ACTIVITY_LIMIT, WEEK_DAYS, WeekDay } from './dashboard-types';
import { OwnerBooking } from './owner-booking.entity';
import { OwnerListing } from './owner-listing.entity';

export interface DayIncome {
  day: WeekDay;
  amount: number;
}

const round = (value: number, decimals = 2): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const weekdayIndex = (date: Date): number => (date.getDay() + 6) % 7;

const startOfWeek = (now: Date): Date => {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  start.setDate(start.getDate() - weekdayIndex(start));
  return start;
};

const isSameMonth = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

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

  static from(bookings: OwnerBooking[], listings: OwnerListing[], now: Date): OwnerDashboard {
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const incomeOf = (month: Date): number =>
      round(
        bookings
          .filter((b) => isSameMonth(b.occurredAt, month))
          .reduce((sum, b) => sum + b.earnedAmount, 0),
      );

    const monthlyIncome = incomeOf(now);
    const previousIncome = incomeOf(previousMonth);
    const monthlyChangePercent =
      previousIncome > 0
        ? Math.round(((monthlyIncome - previousIncome) / previousIncome) * 100)
        : null;

    const weekStart = startOfWeek(now);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const perDay = WEEK_DAYS.map((day): DayIncome => ({ day, amount: 0 }));
    for (const booking of bookings) {
      const at = booking.occurredAt;
      if (at >= weekStart && at < weekEnd) {
        perDay[weekdayIndex(at)].amount = round(
          perDay[weekdayIndex(at)].amount + booking.earnedAmount,
        );
      }
    }

    const ongoing = bookings.filter((b) => b.isOngoing);
    const occupiedListings = new Set(ongoing.map((b) => b.parkingListingId)).size;
    const occupancyPercent = listings.length
      ? Math.round((occupiedListings / listings.length) * 100)
      : 0;
    const averageRating = listings.length
      ? round(listings.reduce((sum, l) => sum + l.rating, 0) / listings.length, 1)
      : null;

    const recentActivity = [...bookings]
      .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
      .slice(0, RECENT_ACTIVITY_LIMIT);

    return new OwnerDashboard(
      monthlyIncome,
      monthlyChangePercent,
      bookings.filter((b) => b.isPending).length,
      ongoing.length,
      listings.length,
      occupancyPercent,
      averageRating,
      perDay,
      recentActivity,
    );
  }
}
