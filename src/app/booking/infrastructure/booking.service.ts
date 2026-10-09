import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { ParkingListing } from '../domain/model/parking-listing.entity';
import { Reservation } from '../domain/model/reservation.entity';
import { ParkingListingsApiEndpoint } from './parking-listings-api-endpoint';
import { ReservationsApiEndpoint } from './reservations-api-endpoint';

@Service()
export class BookingService extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly listingsEndpoint = new ParkingListingsApiEndpoint(this.http);
  private readonly reservationsEndpoint = new ReservationsApiEndpoint(this.http);

  getParkingListings = (): Observable<ParkingListing[]> => this.listingsEndpoint.getAll();

  getReservations = (): Observable<Reservation[]> => this.reservationsEndpoint.getAll();

  createReservation = (reservation: Reservation): Observable<Reservation> =>
    this.reservationsEndpoint.create(reservation);

  updateReservation = (reservation: Reservation): Observable<Reservation> =>
    this.reservationsEndpoint.update(reservation, reservation.id);
}
