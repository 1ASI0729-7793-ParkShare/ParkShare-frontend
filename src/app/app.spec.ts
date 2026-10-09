import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { App } from './app';
import { Layout } from './shared/presentation/components/layout/layout';

@Component({ template: '' })
class EmptyRouteComponent {}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([
          { path: 'profile', component: EmptyRouteComponent },
          { path: 'requests', component: EmptyRouteComponent },
          { path: 'parking-spaces', component: EmptyRouteComponent },
        ]),
        provideTranslateService({ lang: 'es', fallbackLang: 'en' }),
      ],
    }).compileComponents();
  });

  it('should render the shared ParkShare layout', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(fixture.componentInstance).toBeTruthy();
    expect(compiled.querySelector('.brand-name')?.textContent).toContain('ParkShare');
    expect(compiled.querySelector('.user-header')?.textContent).toContain('Daniela Ríos');
    expect(compiled.textContent).toContain('Mi perfil');
  });

  it('should expose the illustrative owner navigation and user', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const layout = fixture.debugElement.children[0].componentInstance as Layout;

    layout.setRole('propietario');
    fixture.detectChanges();

    const labels = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.nav-label'),
    ).map((element) => element.textContent?.trim());
    expect(labels).toEqual(['Panel de control', 'Solicitudes', 'Mis cocheras', 'Mis ingresos']);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Carlos Mendoza');
  });

  it('should select the owner role when navigating directly to parking spaces', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/parking-spaces');
    fixture.detectChanges();

    const layout = fixture.debugElement.children[0].componentInstance as Layout;
    expect(layout.currentRole()).toBe('propietario');
  });
});
