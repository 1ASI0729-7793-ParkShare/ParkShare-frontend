import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { OwnerBooking } from '../domain/model/owner-booking.entity';
import { OwnerListing } from '../domain/model/owner-listing.entity';
import { OwnerBookingsApiEndpoint } from './owner-bookings-api-endpoint';
import { OwnerListingsApiEndpoint } from './owner-listings-api-endpoint';

@Service()
export class ReportAnalyticsService extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly bookingsEndpoint = new OwnerBookingsApiEndpoint(this.http);
  private readonly listingsEndpoint = new OwnerListingsApiEndpoint(this.http);

  getBookings = (): Observable<OwnerBooking[]> => this.bookingsEndpoint.getAll();

  getListings = (): Observable<OwnerListing[]> => this.listingsEndpoint.getAll();
}
