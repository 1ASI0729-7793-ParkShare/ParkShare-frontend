import { Component, inject } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { IncidentReportingStore } from '../../../application/incident-reporting.store';
import { IncidentCard } from '../../components/incident-card/incident-card';

/** Owner view: incidents drivers reported about the owner's spaces. */
@Component({
  selector: 'app-owner-incidents-view',
  imports: [IncidentCard, MatProgressSpinner, TranslatePipe],
  templateUrl: './owner-incidents-view.html',
  styleUrl: './owner-incidents-view.css',
})
export class OwnerIncidentsView {
  protected readonly store = inject(IncidentReportingStore);
}
