import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ReservationStepper } from './reservation-stepper';

describe('ReservationStepper', () => {
  let fixture: ComponentFixture<ReservationStepper>;
  const states = (): string[] =>
    Array.from(fixture.nativeElement.querySelectorAll('.step') as NodeListOf<HTMLElement>).map(
      (el) => el.className.match(/state-(\w+)/)![1],
    );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationStepper],
      providers: [provideTranslateService()],
    }).compileComponents();
    fixture = TestBed.createComponent(ReservationStepper);
  });

  it('should mark earlier steps done and the current one in progress', async () => {
    fixture.componentRef.setInput('status', 'in-use');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(states()).toEqual(['done', 'done', 'current', 'pending']);
  });

  it('should mark every step done once completed', async () => {
    fixture.componentRef.setInput('status', 'completed');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(states()).toEqual(['done', 'done', 'done', 'done']);
  });
});
