import { Injectable } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class BaseFormEventDay {

  errorsMessage = {
    nombre: '',
    fecha: '',
    estado: '',
    recurrencia: '',
    condicionesEvento: this.createMessageArrayError('condicion'),
    asociación: this.createMessageArrayError('id'),
    plantilla: {
      id: '',
      texto: '',
      asociacionesPorPlantilla: this.createMessageArrayError('id'),
    },
  };

  baseForm = this.createBaseForm();

  constructor(private fb: FormBuilder) { }

  createMessageArrayError(id: string) {
    if (id === 'id') {
      return new Array({
        id: '',
        nombre: ''
      });
    } else {
      return new Array({
        id: '',
        condicion: '',
        parametro: ''
      });
    }
  }

  createBaseForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      fecha: ['', [Validators.required, this.validDate]],
      estado: ['', [Validators.required]], // TODO: Crear tipo de dato ACTIVO, INACTIVO
      recurrencia: ['', [Validators.required]], // TODO: Crear tipo de dato ANUAL, DIARIA
      condicionesEvento: this.fb.array([this.createParameterFormGroup('condicion')]),
      asociacion: this.fb.array([this.createParameterFormGroup('id')]),
      plantilla: this.fb.group({
        id: ['', [Validators.required]],
        texto: ['', [Validators.required]],
        asociacionesPorPlantilla: this.fb.array([this.createParameterFormGroup('id')])
      }),
    });
  }

  validDate(control: FormControl): { [key: string]: any } | null {
    const dateVal = control.value;
    return moment(dateVal, 'YYYY-MM-DD', true).isValid() ?
      null : {
        invalidDate: true
      };
  }

  private createParameterFormGroup(id: string): FormGroup {
    if (id === 'id') {
      return new FormGroup({
        id: new FormControl('', Validators.required),
        nombre: new FormControl('', Validators.required)
      });
    } else {
      return new FormGroup({
        id: new FormControl('', Validators.required),
        condicion: new FormControl('', Validators.required),
        parametro: new FormControl('', Validators.required)
      });
    }
  }

  addParameterFormGroup(formGroup: string) {
    const ByName = this.baseForm.get(formGroup) as FormArray;
    ByName.push(this.createParameterFormGroup(formGroup === 'condicionesEvento' ? 'condicion' : 'id'));
    this.addByMessageArrayError(formGroup);
  }

  addByMessageArrayError(ArrayError: string) {
    const MessageErrorArray = this.errorsMessage[ArrayError] as Array<any>;
    MessageErrorArray.push(this.createMessageArrayError(ArrayError === 'condicionesEvento' ? 'condicion' : 'id'));
  }

  removeOrClearParameter(i: number, formGroup: string) {
    const ByName = this.baseForm.get(formGroup) as FormArray;
    if (ByName.length > 1) {
      ByName.removeAt(i);
    } else {
      ByName.reset();
    }
    this.removeOrClearMessageError(i, formGroup);
  }

  removeOrClearMessageError(i: number, ArrayError: string) {
    const MessageErrorArray = this.errorsMessage[ArrayError] as Array<any>;
    if (MessageErrorArray.length > 1) {
      MessageErrorArray.splice(i, i);
    } else {
      MessageErrorArray.splice(MessageErrorArray.length + 1);
    }
  }

  isValidField(field: string, group?: string, i?: number): boolean {
    this.getErrorMessage(field, group, i);
    if (group) {
      if (i !== null) {
        const arrayControl = this.baseForm?.get(group) as FormArray;
        return (
          (arrayControl.at(i)?.get(field).touched || arrayControl.at(i)?.get(field).dirty) && arrayControl.at(i)?.get(field).invalid
        );
      } else {
        const controlGroup = this.baseForm?.get(group) as FormGroup;
        return (
          (controlGroup?.get(field).touched || controlGroup?.get(field).dirty) && !controlGroup?.get(field).valid
        );
      }
    } else {
      const control = this.baseForm?.get(field) as FormControl;
      return ((control.touched || control.dirty) && control.invalid);
    }
  }

  private getErrorMessage(field: string, group?: string, i?: number): void {
    let errorField = null;
    if (group) {
      if (i !== null) {
        const arrayControl = this.baseForm?.get(group) as FormArray;
        const { errors } = arrayControl.at(i)?.get(field);
        errorField = errors;
      } else {
        const { errors } = this.baseForm?.get([group, field]);
        errorField = errors;
      }
    } else {
      const { errors } = this.baseForm?.get(field);
      errorField = errors;
    }


    if (errorField) {
      const minlenght = errorField?.minlength?.requiredLength;
      const messages = {
        required: 'es requerido!',
        minlength: `debe contener al ${minlenght} caracteres`,
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

  onReset(): void {
    this.baseForm.reset();
  }
}



