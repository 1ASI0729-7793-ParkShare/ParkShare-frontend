import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { OwnerBooking } from '../domain/model/owner-booking.entity';
import { OwnerBookingAssembler } from './owner-bookings-assembler';
import { OwnerBookingResource, OwnerBookingsResponse } from './owner-bookings-response';

export class OwnerBookingsApiEndpoint extends BaseApiEndpoint<
  OwnerBooking,
  OwnerBookingResource,
  OwnerBookingsResponse,
  OwnerBookingAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderBookingsEndpointPath}`,
      new OwnerBookingAssembler(),
    );
  }
}
