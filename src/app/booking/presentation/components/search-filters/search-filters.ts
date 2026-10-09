import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { BookingStore } from '../../../application/booking.store';

@Component({
  selector: 'app-search-filters',
  imports: [
    FormsModule,
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
  protected readonly store = inject(BookingStore);

  districtValue = this.store.searchDistrict();
  vehicleValue = this.store.searchVehicle();
  priceValue = this.store.maxPrice();

  vehicles = [
    'Toyota Yaris (BXQ-418)',
    'Honda CRV 2026 (AXQ-432)',
    'Hyundai Accent (F4W-210)',
  ];

  priceOptions = [
    { label: 'S/ 5.00', value: 5.0 },
    { label: 'S/ 6.00', value: 6.0 },
    { label: 'S/ 7.00', value: 7.0 },
    { label: 'S/ 8.00', value: 8.0 },
    { label: 'S/ 10.00', value: 10.0 },
    { label: 'booking.filters.anyPrice', value: null },
  ];

  onSearch(): void {
    this.store.setDistrict(this.districtValue);
    this.store.setVehicle(this.vehicleValue);
    this.store.setMaxPrice(this.priceValue);
  }
}
