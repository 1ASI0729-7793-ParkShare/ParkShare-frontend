import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Observable, catchError, finalize, tap } from 'rxjs';
import { AvailabilityPeriod } from '../domain/model/availability-period.entity';
import { ParkingSpace, ParkingSpacePublicationStatus } from '../domain/model/parking-space.entity';
import {
  CreateParkingSpaceCommand,
  ParkingSpaceRepository,
  UpdateParkingSpaceCommand,
} from './parking-space.repository';

@Injectable()
export class ParkingSpaceManagementStore {
  private readonly repository = inject(ParkingSpaceRepository);
  private readonly destroyRef = inject(DestroyRef);

  private readonly parkingSpacesSignal = signal<ParkingSpace[]>([]);
  readonly parkingSpaces = this.parkingSpacesSignal.asReadonly();

  private readonly selectedParkingSpaceSignal = signal<ParkingSpace | null>(null);
  readonly selectedParkingSpace = this.selectedParkingSpaceSignal.asReadonly();

  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  loadParkingSpaces(): void {
    this.run(this.repository.getAll(), 'parkingSpace.errors.load', (parkingSpaces) =>
      this.parkingSpacesSignal.set(parkingSpaces),
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  loadParkingSpace(id: number): void {
    const cached = this.parkingSpacesSignal().find((parkingSpace) => parkingSpace.id === id);
    if (cached) {
      this.errorSignal.set(null);
      this.selectedParkingSpaceSignal.set(cached);
      return;
    }

    this.selectedParkingSpaceSignal.set(null);
    this.run(this.repository.getById(id), 'parkingSpace.errors.notFound', (parkingSpace) =>
      this.selectedParkingSpaceSignal.set(parkingSpace),
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  createParkingSpace(command: CreateParkingSpaceCommand): Observable<ParkingSpace> {
    return this.run(
      this.repository.create(command),
      'parkingSpace.errors.create',
      (parkingSpace) => {
        this.parkingSpacesSignal.update((parkingSpaces) => [...parkingSpaces, parkingSpace]);
        this.selectedParkingSpaceSignal.set(parkingSpace);
      },
    );
  }

  updateParkingSpace(id: number, command: UpdateParkingSpaceCommand): Observable<ParkingSpace> {
    return this.run(
      this.repository.update(id, command),
      'parkingSpace.errors.update',
      (parkingSpace) => this.replaceParkingSpace(parkingSpace),
    );
  }

  updateAvailability(id: number, availability: AvailabilityPeriod[]): Observable<ParkingSpace> {
    return this.run(
      this.repository.updateAvailability(id, availability),
      'parkingSpace.errors.availability',
      (parkingSpace) => this.replaceParkingSpace(parkingSpace),
    );
  }

  updatePricing(id: number, hourlyRate: number): Observable<ParkingSpace> {
    return this.run(
      this.repository.updatePricing(id, hourlyRate),
      'parkingSpace.errors.pricing',
      (parkingSpace) => this.replaceParkingSpace(parkingSpace),
    );
  }

  updatePublicationStatus(
    id: number,
    status: ParkingSpacePublicationStatus,
  ): Observable<ParkingSpace> {
    return this.run(
      this.repository.updatePublicationStatus(id, status),
      'parkingSpace.errors.publicationStatus',
      (parkingSpace) => this.replaceParkingSpace(parkingSpace),
    );
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  private replaceParkingSpace(updated: ParkingSpace): void {
    this.parkingSpacesSignal.update((parkingSpaces) =>
      parkingSpaces.map((parkingSpace) =>
        parkingSpace.id === updated.id ? updated : parkingSpace,
      ),
    );
    this.selectedParkingSpaceSignal.set(updated);
  }

  private run<T>(
    operation: Observable<T>,
    errorKey: string,
    onSuccess: (result: T) => void,
  ): Observable<T> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return operation.pipe(
      tap(onSuccess),
      catchError(() => {
        this.errorSignal.set(errorKey);
        return EMPTY;
      }),
      finalize(() => this.loadingSignal.set(false)),
    );
  }
}
