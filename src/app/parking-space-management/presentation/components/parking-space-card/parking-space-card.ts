import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ParkingSpace } from '../../../domain/model/parking-space.entity';

@Component({
  imports: [DecimalPipe, MatButtonModule, MatCardModule, RouterLink, TranslatePipe],
  selector: 'app-parking-space-card',
  styleUrl: './parking-space-card.css',
  templateUrl: './parking-space-card.html',
})
export class ParkingSpaceCard {
  readonly parkingSpace = input.required<ParkingSpace>();
}
