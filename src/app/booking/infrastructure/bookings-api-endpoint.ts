import { HttpClient } from '@angular/common/http';
import { Booking } from '../domain/model/booking.entity';
import { BookingResource, BookingsResponse } from './bookings-response';
import { BookingAssembler } from './booking-assembler';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';

export class BookingsApiEndpoint extends BaseApiEndpoint<
  Booking,
  BookingResource,
  BookingsResponse,
  BookingAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderBookingsEndpointPath}`,
      new BookingAssembler(),
    );
  }
}
