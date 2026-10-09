import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ProfileStore } from '../../../application/profile.store';

@Component({
  selector: 'app-user-chip',
  imports: [TranslatePipe],
  templateUrl: './user-chip.html',
  styleUrl: './user-chip.css',
})
export class UserChip {
  protected readonly store = inject(ProfileStore);
  protected readonly initials = computed(() =>
    (this.store.profile()?.fullName ?? '')
      .split(' ')
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase(),
  );
}
