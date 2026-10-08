import { Component, inject, input, output } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { VerificationDocument } from '../../../domain/model/verification-document.entity';

const RELATIVE_TIME_UNITS: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
  { unit: 'month', ms: 30 * 24 * 60 * 60 * 1000 },
  { unit: 'day', ms: 24 * 60 * 60 * 1000 },
  { unit: 'hour', ms: 60 * 60 * 1000 },
  { unit: 'minute', ms: 60 * 1000 },
];

@Component({
  selector: 'app-document-list',
  imports: [MatCard, MatCardContent, MatButton, MatIcon, TranslatePipe],
  templateUrl: './document-list.html',
  styleUrl: './document-list.css',
})
export class DocumentList {
  private readonly translate = inject(TranslateService);

  readonly documents = input.required<VerificationDocument[]>();
  readonly documentUploaded = output<{ document: VerificationDocument; fileName: string }>();

  protected relativeTime(isoDate: string): string {
    const diff = new Date(isoDate).getTime() - Date.now();
    const formatter = new Intl.RelativeTimeFormat(this.translate.currentLang() || 'en', {
      numeric: 'auto',
    });
    const match =
      RELATIVE_TIME_UNITS.find(({ ms }) => Math.abs(diff) >= ms) ??
      RELATIVE_TIME_UNITS[RELATIVE_TIME_UNITS.length - 1];
    return formatter.format(Math.round(diff / match.ms), match.unit);
  }

  protected onFileSelected(document: VerificationDocument, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.documentUploaded.emit({ document, fileName: file.name });
    input.value = '';
  }
}
