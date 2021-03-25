import {Injectable} from '@angular/core';
import {AbstractControl} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormErrorsService {
  errorMap: { [key: string]: (control: AbstractControl, name: string) => string } = {
    required: (control: AbstractControl, name: string) => `${name} es requerido`,
    email: (control: AbstractControl) => `${control.value} no es un email válido`,
    minlength: (control: AbstractControl, name: string) => `
      ${name} debe contener al menos ${control.errors.minlength.requiredLength} caracteres
    `,
    maxlength: (control: AbstractControl, name: string) => `${name} no debe superar ${control.errors.maxlength.requiredLength} caracteres`,
    invalidDate: (control: AbstractControl, name: string) => `El formlato de la ${name}  es inválido (yyyy-mm-dd)`,
  };

  mapErrors(control: AbstractControl, name: string): string[] {
    return Object.keys(control.errors || {})
      .map(key => this.errorMap[key](control, name));
  }
}
