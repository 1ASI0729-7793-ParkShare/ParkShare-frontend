import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParkingSpot } from '../domain/model/parking-spot.entity';
import { Booking } from '../domain/model/booking.entity';
import { ParkingSpotsApiEndpoint } from './parking-spots-api-endpoint';
import { BookingsApiEndpoint } from './bookings-api-endpoint';
import { BaseApi } from '../../shared/infrastructure/base-api';

@Service()
export class BookingService extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly parkingSpotsEndpoint = new ParkingSpotsApiEndpoint(this.http);
  private readonly bookingsEndpoint = new BookingsApiEndpoint(this.http);

  getParkingSpots = (): Observable<ParkingSpot[]> =>
    this.parkingSpotsEndpoint.getAll();

  getParkingSpotById = (id: number): Observable<ParkingSpot> =>
    this.parkingSpotsEndpoint.getById(id);

  getBookings = (): Observable<Booking[]> =>
    this.bookingsEndpoint.getAll();

  getBookingById = (id: number): Observable<Booking> =>
    this.bookingsEndpoint.getById(id);

  createBooking = (booking: Booking): Observable<Booking> =>
    this.bookingsEndpoint.create(booking);

  updateBooking = (booking: Booking): Observable<Booking> =>
    this.bookingsEndpoint.update(booking, booking.id);
}
