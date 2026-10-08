import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatButtonModule,
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
    { link: '/parkings', label: 'Mis cocheras', icon: 'directions_car' },
    { link: '/earnings', label: 'Mis ingresos', icon: 'verified_user' },
  ];

  readonly activeNavOptions = computed(() =>
    this.currentRole() === 'conductor'
      ? this.conductorOptions
      : this.propietarioOptions
  );

  readonly user = computed(() => {
    if (this.currentRole() === 'conductor') {
      return {
        name: 'Daniela Ríos',
        status: 'Conductora verificada',
        initials: 'DR',
        avatarUrl: '',
      };
    } else {
      return {
        name: 'Carlos Mendoza',
        status: 'Propietario • 3 cocheras',
        initials: 'CM',
        avatarUrl: '',
      };
    }
  });

  setRole(role: 'conductor' | 'propietario'): void {
    this.currentRole.set(role);
    if (role === 'conductor') {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/requests']);
    }
  }
}
