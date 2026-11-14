import { OwnerDashboard } from '../domain/model/owner-dashboard';
import { OwnerBookingAssembler } from './owner-bookings-assembler';
import { OwnerDashboardResource } from './owner-dashboard-response';

export class OwnerDashboardAssembler {
  private readonly bookings = new OwnerBookingAssembler();

  toEntityFromResource = (resource: OwnerDashboardResource): OwnerDashboard =>
    new OwnerDashboard(
      resource.monthlyIncome,
      resource.monthlyChangePercent ?? null,
      resource.pendingRequests,
      resource.ongoingReservations,
      resource.publishedListings,
      resource.occupancyPercent,
      resource.averageRating ?? null,
      resource.weeklyIncome.map((d) => ({ day: d.day, amount: d.amount })),
      resource.recentActivity.map((r) => this.bookings.toEntityFromResource(r)),
    );
}
