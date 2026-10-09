import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { SearchFilters } from './search-filters';

describe('SearchFilters', () => {
  let fixture: ComponentFixture<SearchFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFilters],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFilters);
    fixture.componentRef.setInput('criteria', { district: 'Miraflores', maxHourlyRate: 8 });
    fixture.componentRef.setInput('vehicles', ['Toyota Yaris (BXQ-418)']);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should emit the trimmed criteria on submit', () => {
    const emitted: unknown[] = [];
    fixture.componentInstance.searchSubmitted.subscribe((c) => emitted.push(c));
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '  San Isidro ';
    input.dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    expect(emitted).toEqual([{ district: 'San Isidro', maxHourlyRate: 8 }]);
  });
});
