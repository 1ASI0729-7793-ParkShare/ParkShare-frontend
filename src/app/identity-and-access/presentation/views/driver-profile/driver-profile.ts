import { Component, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VerificationDocument } from '../../../domain/model/verification-document.entity';
import { IdentityAndAccessStore } from '../../../application/identity-and-access.store';
import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';

@Component({
  selector: 'app-driver-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './driver-profile.html',
  styleUrl: './driver-profile.css',
})
export class DriverProfile extends BaseForm implements OnInit {
  protected readonly store = inject(IdentityAndAccessStore);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  vehicleForm!: FormGroup;

  readonly vehicleTypes: string[] = ['Sedán', 'SUV', 'Hatchback', 'Camioneta', 'Coupe'];

  constructor() {
    super();
    this.initForm();

    // Synchronize form when vehicle signal updates in store
    effect(() => {
      const vehicle = this.store.vehicle();
      if (vehicle && this.vehicleForm) {
        this.vehicleForm.patchValue(
          {
            plate: vehicle.plate,
            model: vehicle.model,
            vehicleType: vehicle.vehicleType,
          },
          { emitEvent: false }
        );
      }
    });
  }

  ngOnInit(): void {
    if (!this.vehicleForm) {
      this.initForm();
    }
  }

  private initForm(): void {
    this.vehicleForm = this.fb.group({
      plate: ['BXQ-418', [Validators.required, Validators.minLength(6)]],
      model: ['Toyota Yaris 2021', [Validators.required]],
      vehicleType: ['Sedán', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      this.snackBar.open('Por favor completa todos los campos requeridos.', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    const value = this.vehicleForm.value;
    this.store.saveVehicle({
      plate: value.plate,
      model: value.model,
      vehicleType: value.vehicleType,
    });

    this.snackBar.open('¡Cambios guardados con éxito!', 'OK', {
      duration: 3000,
    });
  }

  onUpdateDocument(doc: VerificationDocument): void {
    this.store.updateDocument(doc.id);
    this.snackBar.open(
      `Documento "${doc.name}" enviado para actualización.`,
      'OK',
      { duration: 3000 }
    );
  }
}
