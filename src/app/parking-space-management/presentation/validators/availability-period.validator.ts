import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const availabilityPeriodValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const startTime = control.get('startTime')?.value as string | undefined;
  const endTime = control.get('endTime')?.value as string | undefined;

  if (!startTime || !endTime) {
    return null;
  }

  return startTime < endTime ? null : { invalidTimeRange: true };
};
