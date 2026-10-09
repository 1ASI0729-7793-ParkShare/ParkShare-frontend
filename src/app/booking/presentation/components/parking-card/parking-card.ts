import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ParkingSpot } from '../../../domain/model/parking-spot.entity';

@Component({
  selector: 'app-parking-card',
  imports: [TranslatePipe],
  templateUrl: './parking-card.html',
  styleUrl: './parking-card.css',
})
export class ParkingCard {
  readonly spot = input.required<ParkingSpot>();
  readonly isSelected = input<boolean>(false);

  readonly reserve = output<ParkingSpot>();
  readonly select = output<ParkingSpot>();

  onCardClick(): void {
    this.select.emit(this.spot());
  }

  onReserve(event: MouseEvent): void {
    event.stopPropagation();
    this.reserve.emit(this.spot());
  }
}
