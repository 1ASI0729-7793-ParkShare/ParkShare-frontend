import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter } from 'rxjs';

export interface NavOption {
  link: string;
  label: string;
  icon: string;
  badge?: number | string;
}

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private readonly router = inject(Router);

  readonly currentRole = signal<'conductor' | 'propietario'>('conductor');

  readonly conductorOptions: NavOption[] = [
    { link: '/search', label: 'Buscar cochera', icon: 'search' },
    { link: '/reservations', label: 'Mi reserva', icon: 'schedule' },
    { link: '/history', label: 'Historial', icon: 'history' },
    { link: '/profile', label: 'Mi perfil', icon: 'person' },
  ];

  readonly propietarioOptions: NavOption[] = [
    { link: '/dashboard', label: 'Panel de control', icon: 'tune' },
    { link: '/requests', label: 'Solicitudes', icon: 'schedule', badge: 2 },
    { link: '/parking-spaces', label: 'Mis cocheras', icon: 'directions_car' },
    { link: '/earnings', label: 'Mis ingresos', icon: 'verified_user' },
  ];

  readonly activeNavOptions = computed(() =>
    this.currentRole() === 'conductor' ? this.conductorOptions : this.propietarioOptions,
  );

  readonly user = computed(() =>
    this.currentRole() === 'conductor'
      ? {
          name: 'Daniela Ríos',
          status: 'Conductora verificada',
          initials: 'DR',
          avatarUrl: '',
        }
      : {
          name: 'Carlos Mendoza',
          status: 'Propietario • 3 cocheras',
          initials: 'CM',
          avatarUrl: '',
        },
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
      this.router.navigate(['/requests']);
    }
  }

  private syncRoleWithUrl(url: string): void {
    const ownerPaths = ['/dashboard', '/requests', '/parkings', '/parking-spaces', '/earnings'];
    this.currentRole.set(
      ownerPaths.some((ownerPath) => url.startsWith(ownerPath)) ? 'propietario' : 'conductor',
    );
  }
}
