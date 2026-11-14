import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatOption } from '@angular/material/core';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { ParkingListing } from '../../../../booking/domain/model/parking-listing.entity';
import {
  INCIDENT_TYPE_ICONS,
  INCIDENT_TYPES,
  IncidentType,
  MAX_DESCRIPTION_LENGTH,
  MAX_INCIDENT_PHOTOS,
  MIN_DESCRIPTION_LENGTH,
} from '../../../domain/model/incident-types';
import { IncidentDraft } from '../../../application/incident-reporting.store';
import { compressImage } from '../../utils/image-compressor';

/** Form to report an incident: space, multiple types, description and photos. */
@Component({
  selector: 'app-incident-form',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatHint,
    MatError,
    MatInput,
    MatSelect,
    MatOption,
    MatButton,
    MatIconButton,
    MatIcon,
    TranslatePipe,
  ],
  templateUrl: './incident-form.html',
  styleUrl: './incident-form.css',
})
export class IncidentForm {
  readonly listings = input.required<ParkingListing[]>();
  readonly defaultListingId = input<number | null>(null);
  readonly submitting = input<boolean>(false);
  readonly draftSubmitted = output<IncidentDraft>();

  protected readonly types = INCIDENT_TYPES;
  protected readonly icons = INCIDENT_TYPE_ICONS;
  protected readonly maxPhotos = MAX_INCIDENT_PHOTOS;
  protected readonly maxLength = MAX_DESCRIPTION_LENGTH;
  protected readonly minLength = MIN_DESCRIPTION_LENGTH;

  protected readonly photos = signal<string[]>([]);
  protected readonly photoError = signal<boolean>(false);
  protected readonly canAddPhotos = computed(() => this.photos().length < MAX_INCIDENT_PHOTOS);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    listingId: [null as number | null, Validators.required],
    types: [[] as IncidentType[], Validators.required],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(MIN_DESCRIPTION_LENGTH),
        Validators.maxLength(MAX_DESCRIPTION_LENGTH),
      ],
    ],
  });

  constructor() {
    effect(() => {
      const preferred = this.defaultListingId();
      if (preferred !== null && this.form.controls.listingId.value === null) {
        this.form.controls.listingId.setValue(preferred);
      }
    });
  }

  protected async onPhotosSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []).filter((f) => f.type.startsWith('image/'));
    input.value = '';
    const room = MAX_INCIDENT_PHOTOS - this.photos().length;
    this.photoError.set(files.length > room);
    const added = await Promise.all(files.slice(0, room).map(compressImage));
    this.photos.update((current) => [...current, ...added].slice(0, MAX_INCIDENT_PHOTOS));
  }

  protected removePhoto(index: number): void {
    this.photoError.set(false);
    this.photos.update((current) => current.filter((_, i) => i !== index));
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { listingId, types, description } = this.form.getRawValue();
    const listing = this.listings().find((l) => l.id === listingId);
    if (!listing) return;
    this.draftSubmitted.emit({ listing, types, description, photos: this.photos() });
  }

  /** Clears the form after the report was sent. */
  reset(): void {
    this.form.reset({ listingId: this.defaultListingId(), types: [], description: '' });
    this.photos.set([]);
    this.photoError.set(false);
  }
}
