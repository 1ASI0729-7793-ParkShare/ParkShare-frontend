import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EmergencyAlertsStore } from '../../../application/emergency-alerts.store';
import { EmergencyAlert } from '../../../domain/model/emergency-alert.entity';
import {
  EMERGENCY_KIND_ICONS,
  EMERGENCY_KINDS,
  EMERGENCY_NUMBERS,
  EmergencyKind,
  MAX_EMERGENCY_NOTES_LENGTH,
} from '../../../domain/model/emergency-types';
import { locateDevice } from '../../utils/geolocation';

/** Owner view: SOS button for fire, theft, accident or other emergencies. */
@Component({
  selector: 'app-owner-emergency-view',
  imports: [
    FormsModule,
    MatCard,
    MatCardContent,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatIcon,
    TranslatePipe,
  ],
  templateUrl: './owner-emergency-view.html',
  styleUrl: './owner-emergency-view.css',
})
export class OwnerEmergencyView {
  protected readonly store = inject(EmergencyAlertsStore);
  private readonly translate = inject(TranslateService);

  protected readonly kinds = EMERGENCY_KINDS;
  protected readonly icons = EMERGENCY_KIND_ICONS;
  protected readonly numbers = EMERGENCY_NUMBERS;
  protected readonly maxNotes = MAX_EMERGENCY_NOTES_LENGTH;

  protected readonly panelOpen = signal(false);
  protected readonly kind = signal<EmergencyKind | null>(null);
  protected readonly listingId = signal<number | null>(null);
  protected notes = '';
  protected readonly locating = signal(false);
  protected readonly lastSent = signal<EmergencyAlert | null>(null);

  protected readonly canSend = computed(
    () => this.kind() !== null && !this.locating() && !this.store.loading(),
  );

  constructor() {
    effect(() => {
      const first = this.store.ownerListings()[0];
      if (this.listingId() === null && first) this.listingId.set(first.id);
    });
  }

  protected open(): void {
    this.lastSent.set(null);
    this.panelOpen.set(true);
  }

  protected cancel(): void {
    this.panelOpen.set(false);
    this.kind.set(null);
    this.notes = '';
  }

  protected async send(): Promise<void> {
    const kind = this.kind();
    if (!kind) return;
    const listing = this.store.ownerListings().find((l) => l.id === this.listingId()) ?? null;
    this.locating.set(true);
    const position = await locateDevice();
    this.locating.set(false);
    this.store.raise({ kind, notes: this.notes, listing, position }, (created) => {
      this.lastSent.set(created);
      this.cancel();
    });
  }

  protected dateLabel(iso: string): string {
    const lang = this.translate.currentLang() || 'en';
    return new Intl.DateTimeFormat(lang, { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(iso),
    );
  }
}
