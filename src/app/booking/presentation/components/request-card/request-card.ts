import { Component, computed, inject, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Reservation } from '../../../domain/model/reservation.entity';
import { formatClock, formatShortDate, relativeDay } from '../../utils/day-time';

/** A reservation as seen by the owner, with accept/reject while it is still pending. */
@Component({
  selector: 'app-request-card',
  imports: [DecimalPipe, MatCard, MatCardContent, MatButton, TranslatePipe],
  templateUrl: './request-card.html',
  styleUrl: './request-card.css',
})
export class RequestCard {
  private readonly translate = inject(TranslateService);

  readonly reservation = input.required<Reservation>();
  readonly accepted = output<Reservation>();
  readonly rejected = output<Reservation>();

  protected readonly initials = computed(() =>
    this.reservation()
      .driverName.split(' ')
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase(),
  );

  protected readonly entryLabel = computed(() => {
    const lang = this.translate.currentLang() || 'en';
    const entry = new Date(this.reservation().plannedEntry);
    const day = relativeDay(entry);
    const dayLabel = day ? this.translate.instant(`booking.day.${day}`) : formatShortDate(entry, lang);
    return `${dayLabel}, ${formatClock(entry, lang)}`;
  });
}
