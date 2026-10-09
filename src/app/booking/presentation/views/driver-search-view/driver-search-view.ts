import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { BookingStore } from '../../../application/booking.store';
import { SearchCriteria } from '../../../domain/model/booking-types';
import { ParkingListing } from '../../../domain/model/parking-listing.entity';
import { SearchFilters } from '../../components/search-filters/search-filters';
import { ListingCard } from '../../components/listing-card/listing-card';
import { ListingMap } from '../../components/listing-map/listing-map';

/** Driver view: find a parking space and send a reservation request. */
@Component({
  selector: 'app-driver-search-view',
  imports: [SearchFilters, ListingCard, ListingMap, MatProgressSpinner, TranslatePipe],
  templateUrl: './driver-search-view.html',
  styleUrl: './driver-search-view.css',
})
export class DriverSearchView {
  protected readonly store = inject(BookingStore);
  private readonly router = inject(Router);

  protected readonly highlightedId = signal<number | null>(null);
  protected readonly vehicles = computed(() => {
    const vehicle = this.store.vehicle();
    return vehicle ? [`${vehicle.vehicleModel} (${vehicle.plate})`] : [];
  });

  protected onSearch(criteria: SearchCriteria): void {
    this.store.search(criteria);
  }

  protected onReserve(listing: ParkingListing): void {
    this.store.reserve(listing, () => void this.router.navigateByUrl('/driver/reservation'));
  }

  protected onHover(listing: ParkingListing, hovering: boolean): void {
    this.highlightedId.set(hovering ? listing.id : null);
  }
}
