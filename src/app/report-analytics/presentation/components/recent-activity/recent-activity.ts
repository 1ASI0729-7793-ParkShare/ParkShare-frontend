import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { OwnerBooking } from '../../../domain/model/owner-booking.entity';

@Component({
  selector: 'app-recent-activity',
  imports: [DatePipe, TranslatePipe],
  templateUrl: './recent-activity.html',
  styleUrl: './recent-activity.css',
})
export class RecentActivity {
  readonly items = input.required<OwnerBooking[]>();
}
