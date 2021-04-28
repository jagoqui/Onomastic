import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormErrorsService {
  private errorMap: { [key: string]: (control: AbstractControl) => string } = {
    required: () => `es requerido`,
    email: () => `es inválido`,
    minlength: (control: AbstractControl) => `
      debe contener al menos ${control.errors.minlength.requiredLength} caracteres
    `,
    maxlength: (control: AbstractControl) => ` No debe superar ${control.errors.maxlength.requiredLength} caracteres`,
    invalidDate: () => `de tener formato de fecha(yyyy-mm-dd)`
  };

  private static isValidField(control: AbstractControl): boolean {
    return control.pristine && control.valid && control.untouched;
  }

  searchErrors(field: AbstractControl | FormGroup): string[] {
    if (!field) {
      return;
    }
    if (typeof field.value === 'object') {
      const controls: { [p: string]: AbstractControl } = (field as FormGroup).controls;
      const errors: string[] = [];
      for (const key in controls) {
        if (controls.hasOwnProperty(key)) {
          errors.push(this.mapErrors(controls[key])?.join());
        }
      }
      return errors;
    }
    return this.mapErrors(field);
  }

  private mapErrors(field: AbstractControl): string[] {
    if (FormErrorsService.isValidField(field)) {
      return;
    }
    const formGroup = field.parent.controls;
    const name: string = Object.keys(formGroup).find(name => field === formGroup[name]) || null;
    return Object.keys(field.errors || {})
      .map(key => `${name.toUpperCase()}  ${this.errorMap[key](field)}`);
  }

}
