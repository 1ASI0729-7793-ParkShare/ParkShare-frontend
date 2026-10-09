import { FormControl, FormGroup } from '@angular/forms';
import { availabilityPeriodValidator } from './availability-period.validator';

describe('availabilityPeriodValidator', () => {
  it('should accept a period whose start is earlier than its end', () => {
    const control = new FormGroup(
      {
        startTime: new FormControl('08:00'),
        endTime: new FormControl('10:00'),
      },
      { validators: availabilityPeriodValidator },
    );

    expect(control.valid).toBe(true);
  });

  it('should reject equal or reversed times', () => {
    const control = new FormGroup(
      {
        startTime: new FormControl('10:00'),
        endTime: new FormControl('09:00'),
      },
      { validators: availabilityPeriodValidator },
    );

    expect(control.hasError('invalidTimeRange')).toBe(true);
  });
});
