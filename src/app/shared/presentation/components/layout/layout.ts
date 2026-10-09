import { Component, inject } from '@angular/core';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatListItemIcon, MatListItemTitle, MatNavList } from '@angular/material/list';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { NAV_OPTIONS, NavOption, RoleOption, ROLES, UserRole } from './navigation';
import { NAV_BADGES } from './nav-badges';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatNavList,
    MatListItem,
    MatListItemIcon,
    MatListItemTitle,
    MatIcon,
    MatButtonToggleGroup,
    MatButtonToggle,
    LanguageSwitcher,
    TranslatePipe,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private readonly router = inject(Router);
  private readonly badges = inject(NAV_BADGES);
  protected readonly roles = ROLES;
  protected readonly year = new Date().getFullYear();

  protected currentRole(): UserRole {
    return this.router.url.startsWith('/owner') ? 'owner' : 'driver';
  }

  protected badgeFor(option: NavOption): number | null {
    return (option.badgeKey && this.badges()[option.badgeKey]) || null;
  }

  protected navOptions() {
    return NAV_OPTIONS[this.currentRole()];
  }

  selectRole(role: RoleOption): void {
    this.router.navigateByUrl(role.route).then();
  }
}
