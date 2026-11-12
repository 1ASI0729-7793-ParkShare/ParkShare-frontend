import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Incident } from '../../../domain/model/incident.entity';
import { INCIDENT_TYPE_ICONS } from '../../../domain/model/incident-types';

/** Summary of one incident; the owner variant shows the review/resolve actions. */
@Component({
  selector: 'app-incident-card',
  imports: [MatCard, MatCardContent, MatButton, MatIcon, TranslatePipe],
  templateUrl: './incident-card.html',
  styleUrl: './incident-card.css',
})
export class IncidentCard {
  private readonly translate = inject(TranslateService);

  readonly incident = input.required<Incident>();
  /** Shows the owner actions and the reporter's name. */
  readonly ownerView = input<boolean>(false);
  readonly busy = input<boolean>(false);
  readonly reviewRequested = output<Incident>();
  readonly resolveRequested = output<Incident>();

  protected readonly icons = INCIDENT_TYPE_ICONS;
  protected readonly openedPhoto = signal<string | null>(null);

  protected readonly createdLabel = computed(() => {
    const lang = this.translate.currentLang() || 'en';
    return new Intl.DateTimeFormat(lang, { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(this.incident().createdAt),
    );
  });
}
