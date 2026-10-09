import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { BookingStore } from '../../../application/booking.store';
import { ParkingSpot } from '../../../domain/model/parking-spot.entity';
import { SearchFilters } from '../../components/search-filters/search-filters';
import { ParkingCard } from '../../components/parking-card/parking-card';
import { ParkingMap } from '../../components/parking-map/parking-map';

@Component({
  selector: 'app-driver-search',
  imports: [TranslatePipe, SearchFilters, ParkingCard, ParkingMap],
  templateUrl: './driver-search.html',
  styleUrl: './driver-search.css',
})
export class DriverSearch {
  protected readonly store = inject(BookingStore);
  private readonly router = inject(Router);

  confirmingSpot: ParkingSpot | null = null;

  onSelectSpot(spot: ParkingSpot): void {
    this.store.selectSpot(spot.id);
  }

  onReserveSpot(spot: ParkingSpot): void {
    this.confirmingSpot = spot;
  }

  confirmReservation(): void {
    if (!this.confirmingSpot) return;
    const spot = this.confirmingSpot;
    this.confirmingSpot = null;
    this.store.reserveSpot(spot, () => {
      this.router.navigateByUrl('/driver/reservation');
    });
  }

  cancelReservation(): void {
    this.confirmingSpot = null;
  }
}
