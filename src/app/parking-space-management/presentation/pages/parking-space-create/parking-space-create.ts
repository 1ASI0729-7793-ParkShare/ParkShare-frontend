import { DestroyRef, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ParkingSpaceManagementStore } from '../../../application/parking-space-management.store';
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
  selector: 'app-parking-space-create',
  styleUrl: './parking-space-create.css',
  templateUrl: './parking-space-create.html',
})
export class ParkingSpaceCreate {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly store = inject(ParkingSpaceManagementStore);

  protected readonly days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  protected readonly form = this.formBuilder.nonNullable.group(
    {
      address: ['', [Validators.required, Validators.maxLength(180)]],
      photoUrls: [''],
      hourlyRate: [0, [Validators.required, Validators.min(0.01)]],
      dayOfWeek: ['monday', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    },
    { validators: availabilityPeriodValidator },
  );

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.store
      .createParkingSpace({
        address: value.address.trim(),
        photos: this.parsePhotos(value.photoUrls),
        hourlyRate: value.hourlyRate,
        availability: [
          {
            dayOfWeek: value.dayOfWeek,
            startTime: value.startTime,
            endTime: value.endTime,
          },
        ],
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['/parking-spaces']));
  }

  private parsePhotos(value: string): string[] {
    return value
      .split(/[\n,]/)
      .map((photo) => photo.trim())
      .filter(Boolean);
  }
}
