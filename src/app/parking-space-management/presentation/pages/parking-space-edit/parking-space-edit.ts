import { DestroyRef, Component, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ParkingSpaceManagementStore } from '../../../application/parking-space-management.store';

@Component({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
  ],
  selector: 'app-parking-space-edit',
  styleUrl: './parking-space-edit.css',
  templateUrl: './parking-space-edit.html',
})
export class ParkingSpaceEdit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly store = inject(ParkingSpaceManagementStore);
  protected readonly parkingSpaceId = Number(this.route.snapshot.paramMap.get('id'));
  private patchedParkingSpaceId: number | null = null;

  protected readonly form = this.formBuilder.nonNullable.group({
    address: ['', [Validators.required, Validators.maxLength(180)]],
    photoUrls: [''],
  });

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

      this.form.setValue({
        address: parkingSpace.address,
        photoUrls: parkingSpace.photos.join('\n'),
      });
      this.patchedParkingSpaceId = parkingSpace.id;
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.store
      .updateParkingSpace(this.parkingSpaceId, {
        address: value.address.trim(),
        photos: value.photoUrls
          .split(/[\n,]/)
          .map((photo) => photo.trim())
          .filter(Boolean),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['/owner/parking-spaces']));
  }
}
