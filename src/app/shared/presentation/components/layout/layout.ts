import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs';

export interface NavOption {
  link: string;
  label: string;
  icon: string;
  badge?: number | string;
}

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private readonly router = inject(Router);

  readonly currentRole = signal<'conductor' | 'propietario'>('conductor');

  readonly conductorOptions: NavOption[] = [
    { link: '/profile', label: 'Mi perfil', icon: 'person' },
  ];

  readonly propietarioOptions: NavOption[] = [
    { link: '/parking-spaces', label: 'Mis cocheras', icon: 'directions_car' },
  ];

  readonly activeNavOptions = computed(() =>
    this.currentRole() === 'conductor' ? this.conductorOptions : this.propietarioOptions,
  );

  constructor() {
    this.syncRoleWithUrl(this.router.url);
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => this.syncRoleWithUrl(event.urlAfterRedirects));
  }

  setRole(role: 'conductor' | 'propietario'): void {
    this.currentRole.set(role);
    if (role === 'conductor') {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/parking-spaces']);
    }
  }

  private syncRoleWithUrl(url: string): void {
    this.currentRole.set(url.startsWith('/parking') ? 'propietario' : 'conductor');
  }
}
