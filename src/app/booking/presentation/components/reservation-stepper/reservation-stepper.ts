import { Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { ReservationStatus, SERVICE_STEPS } from '../../../domain/model/booking-types';

type StepState = 'done' | 'current' | 'pending';

/** Horizontal tracker of the reservation lifecycle. */
@Component({
  selector: 'app-reservation-stepper',
  imports: [MatIcon, TranslatePipe],
  templateUrl: './reservation-stepper.html',
  styleUrl: './reservation-stepper.css',
})
export class ReservationStepper {
  readonly status = input.required<ReservationStatus>();

  protected readonly steps = computed(() => {
    const currentIndex = SERVICE_STEPS.indexOf(this.status());
    const lastIndex = SERVICE_STEPS.length - 1;
    return SERVICE_STEPS.map((step, index) => ({
      step,
      // A completed reservation has no step left "in progress".
      state: (index < currentIndex || currentIndex === lastIndex
        ? 'done'
        : index === currentIndex
          ? 'current'
          : 'pending') as StepState,
    }));
  });
}
