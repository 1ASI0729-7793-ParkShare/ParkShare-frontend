import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { MAX_HOURLY_RATE_OPTIONS, SearchCriteria } from '../../../domain/model/booking-types';


/** Filters of the parking search: district, vehicle and maximum hourly price. */
@Component({
  selector: 'app-search-filters',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatButton,
    TranslatePipe,
  ],
  templateUrl: './search-filters.html',
  styleUrl: './search-filters.css',
})
export class SearchFilters {
  readonly criteria = input.required<SearchCriteria>();
  readonly vehicles = input<string[]>([]);
  readonly searchSubmitted = output<SearchCriteria>();

  protected readonly rateOptions = MAX_HOURLY_RATE_OPTIONS;
  protected readonly form = inject(FormBuilder).nonNullable.group({
    district: [''],
    maxHourlyRate: [0],
  });

  constructor() {
    effect(() => this.form.patchValue(this.criteria()));
  }

  protected submit(): void {
    const { district, maxHourlyRate } = this.form.getRawValue();
    this.searchSubmitted.emit({ district: district.trim(), maxHourlyRate });
  }
}
