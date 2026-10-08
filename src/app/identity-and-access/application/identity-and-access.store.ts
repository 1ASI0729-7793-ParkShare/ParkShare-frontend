import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IdentityAndAccessService } from '../infrastructure/identity-and-access.service';
import { DriverProfile } from '../domain/model/driver-profile.entity';
import { Vehicle } from '../domain/model/vehicle.entity';

@Injectable({
  providedIn: 'root',
})
export class IdentityAndAccessStore {
  private readonly service = inject(IdentityAndAccessService);

  private readonly profileSignal = signal<DriverProfile | null>(null);
  readonly profile = this.profileSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly vehicle = computed(() => this.profile()?.vehicle ?? null);
  readonly documents = computed(() => this.profile()?.documents ?? []);
  readonly role = computed(() => this.profile()?.role ?? 'conductor');

  constructor() {
    this.loadProfile();
  }

  loadProfile(id: number = 1): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.service
      .getDriverProfile(id)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (profile) => {
          this.profileSignal.set(profile);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(err?.message || 'Error al cargar perfil');
          this.loadingSignal.set(false);
        },
      });
  }

  saveVehicle(vehicleData: Omit<Vehicle, 'id'>): void {
    const current = this.profileSignal();
    if (!current) return;

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const updatedVehicle: Vehicle = {
      id: current.vehicle.id || 1,
      ...vehicleData,
    };

    this.service.updateVehicle(current.id, updatedVehicle).subscribe({
      next: (updatedProfile) => {
        this.profileSignal.set(updatedProfile);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err?.message || 'Error al actualizar vehículo');
        this.loadingSignal.set(false);
      },
    });
  }

  updateDocument(documentId: number): void {
    const current = this.profileSignal();
    if (!current) return;

    this.loadingSignal.set(true);
    this.service.updateDocument(current.id, documentId).subscribe({
      next: (updatedProfile) => {
        this.profileSignal.set({ ...updatedProfile });
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err?.message || 'Error al actualizar documento');
        this.loadingSignal.set(false);
      },
    });
  }
}
