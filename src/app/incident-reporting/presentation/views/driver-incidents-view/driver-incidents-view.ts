import { Component, inject, viewChild } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IncidentDraft, IncidentReportingStore } from '../../../application/incident-reporting.store';
import { IncidentCard } from '../../components/incident-card/incident-card';
import { IncidentForm } from '../../components/incident-form/incident-form';

const SNACKBAR_DURATION_MS = 5000;

/** Driver view: report a problem with a parking space and follow previous reports. */
@Component({
  selector: 'app-driver-incidents-view',
  imports: [IncidentForm, IncidentCard, MatProgressSpinner, TranslatePipe],
  templateUrl: './driver-incidents-view.html',
  styleUrl: './driver-incidents-view.css',
})
export class DriverIncidentsView {
  protected readonly store = inject(IncidentReportingStore);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);
  private readonly form = viewChild.required(IncidentForm);

  protected onSubmit(draft: IncidentDraft): void {
    this.store.report(draft, () => {
      this.form().reset();
      this.snackBar.open(this.translate.instant('incidents.driver.sent'), undefined, {
        duration: SNACKBAR_DURATION_MS,
      });
    });
  }
}
