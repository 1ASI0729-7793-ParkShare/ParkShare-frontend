import { DecimalPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
  ParkingSpace,
  ParkingSpacePublicationStatus,
} from '../../../domain/model/parking-space.entity';

@Component({
  imports: [DecimalPipe, MatCardModule, RouterLink, TranslatePipe],
  selector: 'app-parking-space-card',
  styleUrl: './parking-space-card.css',
  templateUrl: './parking-space-card.html',
})
export class ParkingSpaceCard {
  readonly parkingSpace = input.required<ParkingSpace>();
  readonly publicationStatusChange = output<{
    id: number;
    status: ParkingSpacePublicationStatus;
  }>();

  protected readonly scheduleDayKey = computed(() => {
    const days = this.parkingSpace().availability.map((period) => period.dayOfWeek);

    if (days.length === 7) {
      return 'parkingSpace.card.everyDay';
    }
    if (days.join(',') === 'monday,tuesday,wednesday,thursday,friday') {
      return 'parkingSpace.card.weekdays';
    }
    if (days.join(',') === 'saturday,sunday') {
      return 'parkingSpace.card.weekend';
    }
    return days[0] ? `parkingSpace.days.${days[0]}` : 'parkingSpace.card.noSchedule';
  });

  protected readonly firstPeriod = computed(() => this.parkingSpace().availability[0] ?? null);

  protected togglePublicationStatus(): void {
    const parkingSpace = this.parkingSpace();
    this.publicationStatusChange.emit({
      id: parkingSpace.id,
      status: parkingSpace.publicationStatus === 'published' ? 'paused' : 'published',
    });
  }
}
