import { FormGroup } from '@angular/forms';

/**
 * Provides reusable validation helpers for reactive form components.
 */
export class BaseForm {
  /**
   * Checks if a form control is invalid and has been touched.
   */
  protected isInvalidControl = (form: FormGroup, controlName: string): boolean =>
    Boolean(form.controls[controlName]?.invalid && form.controls[controlName]?.touched);

  /**
   * Generates an error message for a specific error key on a control.
   */
  private errorMessageForControl = (controlName: string, errorKey: string): string => {
    switch (errorKey) {
      case 'required':
        return `El campo ${controlName} es obligatorio.`;
      case 'minlength':
        return `El campo ${controlName} no cumple la longitud mínima.`;
      case 'pattern':
        return `El formato del campo ${controlName} no es válido.`;
      default:
        return `El campo ${controlName} es inválido.`;
    }
  };

  /**
   * Retrieves all error messages for a form control.
   */
  protected errorMessagesForControl = (form: FormGroup, controlName: string): string => {
    const control = form.controls[controlName];
    let errorMessages = '';
    const errors = control?.errors;
    if (!errors) return errorMessages;
    Object.keys(errors).forEach((errorKey) => {
      errorMessages += this.errorMessageForControl(controlName, errorKey) + ' ';
    });
    return errorMessages.trim();
  };
}
