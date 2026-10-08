import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ParkingSpaceManagementStore } from '../../../application/parking-space-management.store';
import { ParkingSpaceCard } from '../../components/parking-space-card/parking-space-card';

@Component({
  imports: [MatButtonModule, MatProgressSpinnerModule, ParkingSpaceCard, RouterLink, TranslatePipe],
  selector: 'app-parking-space-list',
  styleUrl: './parking-space-list.css',
  templateUrl: './parking-space-list.html',
})
export class ParkingSpaceList {
  protected readonly store = inject(ParkingSpaceManagementStore);

  constructor() {
    this.store.loadParkingSpaces();
  }
}
