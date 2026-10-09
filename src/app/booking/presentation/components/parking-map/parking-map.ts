import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ParkingSpot } from '../../../domain/model/parking-spot.entity';

@Component({
  selector: 'app-parking-map',
  imports: [TranslatePipe],
  templateUrl: './parking-map.html',
  styleUrl: './parking-map.css',
})
export class ParkingMap {
  readonly spots = input.required<ParkingSpot[]>();
  readonly selectedSpotId = input<number | null>(null);

  readonly spotSelected = output<ParkingSpot>();

  onSelectSpot(spot: ParkingSpot): void {
    this.spotSelected.emit(spot);
  }
}
