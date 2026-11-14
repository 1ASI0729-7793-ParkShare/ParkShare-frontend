import { WeekDay } from '../domain/model/dashboard-types';
import { OwnerBookingResource } from './owner-bookings-response';

export interface OwnerDashboardResource {
  monthlyIncome: number;
  monthlyChangePercent: number | null;
  pendingRequests: number;
  ongoingReservations: number;
  publishedListings: number;
  occupancyPercent: number;
  averageRating: number | null;
  weeklyIncome: { day: WeekDay; amount: number }[];
  recentActivity: OwnerBookingResource[];
}
