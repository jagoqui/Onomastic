import {Injectable} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators,} from '@angular/forms';
import * as moment from 'moment';

@Injectable({providedIn: 'root'})
export class BaseFormMailUsers {
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
    genero: '',
    asociacionPorUsuarioCorreo: this.createByNameArrayError('id'),
    programaAcademicoPorUsuarioCorreo: this.createByNameArrayError('codigo'),
    vinculacionPorUsuarioCorreo: this.createByNameArrayError('id'),
    plataformaPorUsuarioCorreo: this.createByNameArrayError('id')
  };
  baseForm = this.createBaseForm();
  private emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  constructor(private fb: FormBuilder) {
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
      genero: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      estado: ['', [Validators.required]],
      asociacionPorUsuarioCorreo: this.fb.array([this.createByNameFormGroup('id')]),
      programaAcademicoPorUsuarioCorreo: this.fb.array([this.createByNameFormGroup('codigo')]),
      vinculacionPorUsuarioCorreo: this.fb.array([this.createByNameFormGroup('id')]),
      plataformaPorUsuarioCorreo: this.fb.array([this.createByNameFormGroup('id')]),
    });
  }

  createByNameArrayError(id: string) {
    if (id === 'id') {
      return new Array({
        id: '',
        nombre: ''
      });
    } else {
      return new Array({
        codigo: '',
        nombre: ''
      });
    }
  }

  addByNameFormGroup(formGroup: string) {
    const byName = this.baseForm.get(formGroup) as FormArray;
    byName.push(this.createByNameFormGroup(formGroup === 'programaAcademicoPorUsuarioCorreo' ? 'codigo' : 'id'));
    this.addByNameArrayError(formGroup);
  }

  removeOrClearByName(i: number, formGroup: string) {
    const byName = this.baseForm.get(formGroup) as FormArray;
    if (byName.length > 1) {
      byName.removeAt(i);
    } else {
      byName.reset();
    }
    this.removeOrClearByNameArrayError(i, formGroup);
  }

  addByNameArrayError(arrayError: string) {
    const byNameErrorArray = this.errorsMessage[arrayError] as Array<any>;
    byNameErrorArray.push(this.createByNameArrayError(arrayError === 'programaAcademicoPorUsuarioCorreo' ? 'codigo' : 'id'));
  }

  removeOrClearByNameArrayError(i: number, arrayError: string) {
    const byNameErrorArray = this.errorsMessage[arrayError] as Array<any>;
    if (byNameErrorArray.length > 1) {
      byNameErrorArray.splice(i, i);
    } else {
      byNameErrorArray.splice(byNameErrorArray.length + 1);
    }
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

  onReset(): void {
    this.baseForm.reset();
  }

  private createByNameFormGroup(id: string): FormGroup {
    if (id === 'id') {
      return new FormGroup({
        id: new FormControl('', Validators.required),
        nombre: new FormControl('', Validators.required)
      });
    } else {
      return new FormGroup({
        codigo: new FormControl('', Validators.required),
        nombre: new FormControl('', Validators.required)
      });
    }
  }

  private getErrorMessage(field: string, group?: string, i?: number): void {
    let errorField = null;
    if (group) {
      if (i !== null) {
        const arrayControl = this.baseForm.get(group) as FormArray;
        const {errors} = arrayControl.at(i).get(field);
        errorField = errors;
      } else {
        const {errors} = this.baseForm.get([group, field]);
        errorField = errors;
      }
    } else {
      const {errors} = this.baseForm.get(field);
      errorField = errors;
    }


    if (errorField) {
      const minlenght = errorField?.minlength?.requiredLength;
      const messages = {
        required: 'es requerido!',
        pattern: `es ivalido!`,
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
}
