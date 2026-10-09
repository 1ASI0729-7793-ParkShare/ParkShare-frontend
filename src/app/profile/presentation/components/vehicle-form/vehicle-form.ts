import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Profile } from '../../../domain/model/profile.entity';
import { PLATE_PATTERN, VEHICLE_TYPES, VehicleType } from '../../../domain/model/profile-types';

/** Form to view and edit the registered vehicle of a profile. */
@Component({
  selector: 'app-vehicle-form',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatSelect,
    MatOption,
    MatButton,
    MatIcon,
    TranslatePipe,
  ],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.css',
})
export class VehicleForm {
  readonly profile = input.required<Profile>();
  readonly profileSubmitted = output<Profile>();

  protected readonly vehicleTypes = VEHICLE_TYPES;
  protected readonly form = inject(FormBuilder).nonNullable.group({
    plate: ['', [Validators.required, Validators.pattern(PLATE_PATTERN)]],
    vehicleModel: ['', Validators.required],
    vehicleType: ['' as VehicleType, Validators.required],
  });

  constructor() {
    effect(() => {
      const profile = this.profile();
      this.form.patchValue({
        plate: profile.plate,
        vehicleModel: profile.vehicleModel,
        vehicleType: profile.vehicleType,
      });
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.profileSubmitted.emit(
      new Profile({
        id: this.profile().id,
        fullName: this.profile().fullName,
        plate: value.plate.toUpperCase(),
        vehicleModel: value.vehicleModel.trim(),
        vehicleType: value.vehicleType,
      }),
    );
  }
}
