import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { ParkingListing } from '../../../domain/model/parking-listing.entity';

/** A search result: space summary with its price and a reserve action. */
@Component({
  selector: 'app-listing-card',
  imports: [DecimalPipe, MatCard, MatCardContent, MatButton, MatIcon, TranslatePipe],
  templateUrl: './listing-card.html',
  styleUrl: './listing-card.css',
})
export class ListingCard {
  readonly listing = input.required<ParkingListing>();
  readonly canReserve = input(true);
  readonly highlighted = input(false);
  readonly reserve = output<ParkingListing>();
  readonly hoverChange = output<boolean>();
}
