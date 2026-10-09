import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { App } from './app';
import { UserChip } from './profile/presentation/components/user-chip/user-chip';
import { Layout } from './shared/presentation/components/layout/layout';

@Component({ template: '' })
class EmptyRouteComponent {}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          {
            path: 'driver',
            children: [{ path: 'search', component: EmptyRouteComponent }],
          },
          {
            path: 'owner',
            children: [
              { path: 'dashboard', component: EmptyRouteComponent },
              { path: 'parking-spaces', component: EmptyRouteComponent },
            ],
          },
        ]),
        provideTranslateService({ lang: 'es', fallbackLang: 'en' }),
      ],
    }).compileComponents();
  });

  it('should render the shared layout with the illustrative driver', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(fixture.componentInstance).toBeTruthy();
    expect(compiled.querySelector('.brand-logo')?.textContent).toContain('P');
    expect(compiled.querySelector('app-user-chip')?.textContent).toContain('Daniela Ríos');
  });

  it('should expose the owner navigation and illustrative owner on owner routes', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    fixture.detectChanges();
    await router.navigateByUrl('/owner/parking-spaces');
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.url).toBe('/owner/parking-spaces');

    const layout = fixture.debugElement.query(By.directive(Layout))
      .componentInstance as unknown as {
      currentRole: () => string;
      navOptions: () => Array<{ route: string }>;
    };
    const userChip = fixture.debugElement.query(By.directive(UserChip))
      .componentInstance as unknown as { displayName: () => string };

    expect(layout.currentRole()).toBe('owner');
    expect(layout.navOptions().map((option) => option.route)).toEqual([
      '/owner/dashboard',
      '/owner/requests',
      '/owner/parking-spaces',
      '/owner/earnings',
    ]);
    expect(userChip.displayName()).toBe('Carlos Mendoza');
  });
});

