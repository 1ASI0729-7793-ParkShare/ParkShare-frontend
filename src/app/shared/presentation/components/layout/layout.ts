import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatListItem, MatListItemIcon, MatListItemTitle, MatNavList } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, map } from 'rxjs';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { NAV_OPTIONS, RoleOption, ROLES, UserRole } from './navigation';

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
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly roles = ROLES;
  protected readonly year = new Date().getFullYear();

  protected readonly currentRole = computed<UserRole>(
    () => ROLES.find((r) => this.currentUrl().startsWith(r.route))?.role ?? 'driver',
  );
  protected readonly navOptions = computed(() => NAV_OPTIONS[this.currentRole()]);

  selectRole(role: RoleOption): void {
    this.router.navigateByUrl(role.route).then();
  }
}
