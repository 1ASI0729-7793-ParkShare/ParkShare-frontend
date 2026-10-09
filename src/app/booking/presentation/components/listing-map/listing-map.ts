import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ParkingListing } from '../../../domain/model/parking-listing.entity';


/** Share of the map kept free around the outermost pins. */
const MAP_PADDING_PERCENT = 12;

interface Pin {
  listing: ParkingListing;
  left: number;
  top: number;
}

/** Schematic map: places each listing's price pin by its coordinates. */
@Component({
  selector: 'app-listing-map',
  imports: [DecimalPipe, TranslatePipe],
  templateUrl: './listing-map.html',
  styleUrl: './listing-map.css',
})
export class ListingMap {
  readonly listings = input.required<ParkingListing[]>();
  readonly highlightedId = input<number | null>(null);

  protected readonly pins = computed<Pin[]>(() => {
    const listings = this.listings();
    const lats = listings.map((l) => l.latitude);
    const lngs = listings.map((l) => l.longitude);
    const place = (value: number, min: number, max: number): number =>
      max === min
        ? 50
        : MAP_PADDING_PERCENT + ((value - min) / (max - min)) * (100 - 2 * MAP_PADDING_PERCENT);
    return listings.map((listing) => ({
      listing,
      left: place(listing.longitude, Math.min(...lngs), Math.max(...lngs)),
      // Latitude grows northwards, screen coordinates grow downwards.
      top: 100 - place(listing.latitude, Math.min(...lats), Math.max(...lats)),
    }));
  });
}
