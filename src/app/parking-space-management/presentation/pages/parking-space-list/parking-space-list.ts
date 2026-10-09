import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ParkingSpaceManagementStore } from '../../../application/parking-space-management.store';
import { ParkingSpacePublicationStatus } from '../../../domain/model/parking-space.entity';
import { ParkingSpaceCard } from '../../components/parking-space-card/parking-space-card';

@Component({
  imports: [MatButtonModule, MatProgressSpinnerModule, ParkingSpaceCard, RouterLink, TranslatePipe],
  selector: 'app-parking-space-list',
  styleUrl: './parking-space-list.css',
  templateUrl: './parking-space-list.html',
})
export class ParkingSpaceList {
  protected readonly store = inject(ParkingSpaceManagementStore);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.store.loadParkingSpaces();
  }

  protected updatePublicationStatus(event: {
    id: number;
    status: ParkingSpacePublicationStatus;
  }): void {
    this.store
      .updatePublicationStatus(event.id, event.status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
