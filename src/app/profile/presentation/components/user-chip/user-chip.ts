import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
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
  private readonly router = inject(Router);

  protected isOwner(): boolean {
    return this.router.url.startsWith('/owner');
  }

  protected displayName(): string {
    return this.isOwner() ? 'Carlos Mendoza' : (this.store.profile()?.fullName ?? 'Daniela Ríos');
  }

  protected initials(): string {
    return this.displayName()
      .split(' ')
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
