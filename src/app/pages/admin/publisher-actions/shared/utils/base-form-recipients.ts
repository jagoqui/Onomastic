import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class BaseFormRecipients {
  errorsMessage = {
    nombre: '',
    apellido: '',
    id: {
      tipoIdentificacion: '',
      numeroIdentificacion: ''
    },
    email: '',
    fechaNacimiento: '',
    estado: '',
    genero: ''
  };
  baseForm = this.createBaseForm();

  constructor(private fb: FormBuilder) {
  }

  private static createByNameFormGroup(id: string): FormGroup {
    if (id === 'id') {
      return new FormGroup({
        id: new FormControl(null),
        nombre: new FormControl(null)
      });
    } else {
      return new FormGroup({
        unidadAcademica: this.createByNameFormGroup('id'),
        codigo: new FormControl(null),
        nombre: new FormControl(null)
      });
    }
  }

  createBaseForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      id: this.fb.group({
        tipoIdentificacion: ['', [Validators.required]],
        numeroIdentificacion: ['', [Validators.required]]
      }),
      fechaNacimiento: ['', [Validators.required, this.validDate]],
      genero: ['', [Validators.required]], //TODO: No está detectando campo invalido si éste campo no lo tiene al editar.
      email: ['', [Validators.required, Validators.email]],
      estado: ['', [Validators.required]],
      unidadAdministrativaPorCorreoUsuario: [BaseFormRecipients.createByNameFormGroup('id')],
      programaAcademicoPorUsuarioCorreo: [BaseFormRecipients.createByNameFormGroup('codigo')],
      vinculacionPorUsuarioCorreo: [BaseFormRecipients.createByNameFormGroup('id'), Validators.required],
      plataformaPorUsuarioCorreo: [BaseFormRecipients.createByNameFormGroup('id'), Validators.required]
    });
  }

  validDate(control: FormControl): { [key: string]: any } | null {
    const dateVal = control.value;
    return moment(dateVal, 'YYYY-MM-DD', true).isValid() ?
      null : {
        invalidDate: true
      };
  }

  isValidField(field: string, group?: string, i?: number): boolean {
    this.getErrorMessage(field, group, i);
    if (group) {
      if (i !== null) {
        const arrayControl = this.baseForm.get(group) as FormArray;
        return (
          (arrayControl.at(i).get(field).touched || arrayControl.at(i).get(field).dirty) && arrayControl.at(i).get(field).invalid
        );
      } else {
        const controlGroup = this.baseForm.get(group) as FormGroup;
        return (
          (controlGroup.get(field).touched || controlGroup.get(field).dirty) && !controlGroup.get(field).valid
        );
      }
    } else {
      const control = this.baseForm.get(field) as FormControl;
      return ((control.touched || control.dirty) && control.invalid);
    }
  }

  private getErrorMessage(field: string, group?: string, i?: number): void {
    let errorField: ValidationErrors;
    if (group) {
      if (i !== null) {
        const arrayControl = this.baseForm.get(group) as FormArray;
        const { errors } = arrayControl.at(i).get(field);
        errorField = errors;
      } else {
        const { errors } = this.baseForm.get([group, field]);
        errorField = errors;
      }
    } else {
      const { errors } = this.baseForm.get(field);
      errorField = errors;
    }


    if (errorField) {
      const minlength = errorField?.minlength?.requiredLength;
      const messages = {
        required: 'es requerido!',
        pattern: `es ivalido!`,
        minlength: `debe contener al ${minlength} caracteres`
      };
      const errorKey = Object.keys(errorField).find(Boolean);

      if (group) {
        if (i !== null) {
          const errorsArray = this.errorsMessage[group] as Array<any>;
          errorsArray[i][field] = 'El campo ' + messages[errorKey];
        } else {
          this.errorsMessage[group][field] = 'El campo ' + messages[errorKey];
        }
      } else {
        this.errorsMessage[field] = 'El campo ' + messages[errorKey];
      }
    } else {
      if (group) {
        if (i !== null) {
          const errorsArray = this.errorsMessage[group] as Array<any>;
          errorsArray[i][field] = null;
        }
        this.errorsMessage[group][field] = null;
      } else {
        this.errorsMessage[field] = null;
      }
    }
  }
}
