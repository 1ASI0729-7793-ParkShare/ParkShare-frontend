import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { appConfig } from './app.config';
import { Layout } from './shared/presentation/components/layout/layout';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: appConfig.providers,
    }).compileComponents();
  });

  it('should create the app and render layout for Conductor by default', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-name')?.textContent).toContain('ParkShare');
    expect(compiled.querySelector('.user-name')?.textContent).toContain('Daniela Ríos');
    expect(compiled.textContent).toContain('Buscar cochera');
    expect(compiled.textContent).toContain('Mi perfil');
  });

  it('should switch navigation options and user profile when Propietario is selected', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const layoutDebug = fixture.debugElement.children[0];
    const layout = layoutDebug.componentInstance as Layout;
    layout.setRole('propietario');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.user-name')?.textContent).toContain('Carlos Mendoza');
    expect(compiled.querySelector('.user-status')?.textContent).toContain('3 cocheras');
    expect(compiled.textContent).toContain('Panel de control');
    expect(compiled.textContent).toContain('Solicitudes');
    expect(compiled.textContent).toContain('Mis cocheras');
    expect(compiled.textContent).toContain('Mis ingresos');


    expect(compiled.querySelector('.nav-badge')?.textContent).toContain('2');
  });
});
