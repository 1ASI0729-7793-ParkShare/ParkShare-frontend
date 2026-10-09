import { DestroyRef, Component, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ParkingSpaceManagementStore } from '../../../application/parking-space-management.store';
import { AvailabilityPeriod } from '../../../domain/model/availability-period.entity';
import { availabilityPeriodValidator } from '../../validators/availability-period.validator';

@Component({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
  ],
  selector: 'app-parking-space-availability',
  styleUrl: './parking-space-availability.css',
  templateUrl: './parking-space-availability.html',
})
export class ParkingSpaceAvailability {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly store = inject(ParkingSpaceManagementStore);
  protected readonly parkingSpaceId = Number(this.route.snapshot.paramMap.get('id'));
  private patchedParkingSpaceId: number | null = null;

  protected readonly days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  protected readonly form = this.formBuilder.group({
    periods: this.formBuilder.array([this.createPeriod()]),
  });

  protected get periods(): FormArray {
    return this.form.controls.periods;
  }

  constructor() {
    this.store.loadParkingSpace(this.parkingSpaceId);

    effect(() => {
      const parkingSpace = this.store.selectedParkingSpace();
      if (
        parkingSpace?.id !== this.parkingSpaceId ||
        this.patchedParkingSpaceId === parkingSpace.id
      ) {
        return;
      }

      this.periods.clear();
      const periods =
        parkingSpace.availability.length > 0
          ? parkingSpace.availability
          : [{ dayOfWeek: 'monday', startTime: '', endTime: '' }];
      periods.forEach((period) => this.periods.push(this.createPeriod(period)));
      this.patchedParkingSpaceId = parkingSpace.id;
    });
  }

  protected addPeriod(): void {
    this.periods.push(this.createPeriod());
  }

  protected removePeriod(index: number): void {
    if (this.periods.length > 1) {
      this.periods.removeAt(index);
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const availability = this.periods.controls.map(
      (period) => period.getRawValue() as AvailabilityPeriod,
    );
    this.store
      .updateAvailability(this.parkingSpaceId, availability)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['/parking-spaces']));
  }

  private createPeriod(period?: AvailabilityPeriod) {
    return this.formBuilder.nonNullable.group(
      {
        dayOfWeek: [period?.dayOfWeek ?? 'monday', Validators.required],
        startTime: [period?.startTime ?? '', Validators.required],
        endTime: [period?.endTime ?? '', Validators.required],
      },
      { validators: availabilityPeriodValidator },
    );
  }
}
