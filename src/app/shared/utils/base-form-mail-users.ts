import { Injectable } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class BaseFormMailUsers {
  private emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  private birthdayPattern = '/^\d{4}-\d{2}-\d{2}$/';
  errorMessage = {
    id: {
      tipoIdentificacion: '',
      numeroIdentificacion: ''
    },
    nombre: '',
    apellido: '',
    email: '',
    fechaNacimiento: '',
    estado: '',
    genero: '',
    asociacionPorUsuarioCorreo: {
      id: '',
      nombre: ''
    },
    vinculacionPorUsuarioCorreo: {
      id: '',
      nombre: ''
    },
    programaAcademicoPorUsuarioCorreo: {
      codigo: '',
      nombre: ''
    },
  };

  constructor(private fb: FormBuilder) { }

  baseForm = this.fb.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    id: this.fb.group({
      tipoIdentificacion: ['', [Validators.required]],
      numeroIdentificacion: ['', [Validators.required]]
    }),
    fechaNacimiento: ['', [Validators.required, Validators.pattern(this.birthdayPattern), this.birthdayValidator]],
    genero: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    asociacionPorUsuarioCorreo: this.fb.array([this.createByNameFormGroup('id')]),
    vinculacionPorUsuarioCorreo: this.fb.array([this.createByNameFormGroup('id')]),
    programaAcademicoPorUsuarioCorreo: this.fb.array([this.createByNameFormGroup('codigo')]),
    estado: ['', [Validators.required]],
  });

  private createByNameFormGroup(id: string): FormGroup {
    if (id === 'id') {
      return new FormGroup({
        id: new FormControl('', Validators.required),
        nobre: new FormControl('', Validators.required)
      });
    } else {
      return new FormGroup({
        codigo: new FormControl('', Validators.required),
        nobre: new FormControl('', Validators.required)
      });
    }
  }

  public addByNameFormGroup(formGroup: string) {
    const ByName = this.baseForm.get(formGroup) as FormArray;
    ByName.push(this.createByNameFormGroup(formGroup === 'programaAcademicoPorUsuarioCorreo' ? 'codigo' : 'id'));
  }

  public removeOrClearByName(i: number, formGroup: string) {
    const ByName = this.baseForm.get(formGroup) as FormArray;
    if (ByName.length > 1) {
      ByName.removeAt(i);
    } else {
      ByName.reset();
    }
  }

  birthdayValidator(control: FormControl) {
    // this.baseForm?.controls.fechaNacimiento?.setValue(moment().format('YYYY-MM-DD'));
    // console.log(this.baseForm?.controls.fechaNacimiento.value());
    if (control.value) {
      console.log(control.value);
      return true;
    } else {
      return null;
    }
  }

  isValidField(field: string, group?: string): boolean {
    this.getErrorMessage(field, group);
    if (group) {
      return (
        (this.baseForm.get([group, field]).touched || this.baseForm.get([group, field]).dirty) && !this.baseForm.get([group, field]).valid
      );
    } else {
      return ((this.baseForm.get(field).touched || this.baseForm.get(field).dirty) && !this.baseForm.get(field).valid);
    }
  }

  private getErrorMessage(field: string, group?: string): void {
    let errorField = null;
    if (group) {
      const { errors } = this.baseForm.get([group, field]);
      errorField = errors;
    } else {
      const { errors } = this.baseForm.get(field);
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
        this.errorMessage[group][field] = 'El campo ' + messages[errorKey];
      } else {
        this.errorMessage[field] = 'El campo ' + messages[errorKey];
      }
    } else {
      if (group) {
        this.errorMessage[group][field] = null;
      } else {
        this.errorMessage[field] = null;
      }
    }
  }

  onReset(): void {
    this.baseForm.reset();
  }
}
