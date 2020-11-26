import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class BaseFormMailUsers {
  private emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  private birthdayPattern = '^\d{4}([\-/.])(0?[1-9]|1[1-2])\1(3[01]|[12][0-9]|0?[1-9])$';
  // private passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}';
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
      id: '',
      nombre: ''
    },
  };

  constructor(private fb: FormBuilder) { }

  baseForm = this.fb.group({
    id: this.fb.group({
      tipoIdentificacion: ['', [Validators.required]],
      numeroIdentificacion: ['', [Validators.required]]
    }),
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    fechaNacimiento: ['', [Validators.required, Validators.pattern(this.birthdayPattern)]],
    estado: ['', [Validators.required]],
    genero: ['', [Validators.required]],
    asociacionPorUsuarioCorreo: this.fb.array([
      {
        id: ['', [Validators.required]],
        nombre: ['', [Validators.required]]
      }
    ]),
    programaAcademicoPorUsuarioCorreo: this.fb.array([
      {
        id: ['', [Validators.required]],
        nombre: ['', [Validators.required]]
      }
    ]),
    vinculacionPorUsuarioCorreo: this.fb.array([
      {
        id: ['', [Validators.required]],
        nombre: ['', [Validators.required]]
      }
    ]),
  });

  isValidField(field?: string): boolean {
    this.getErrorMessage(field);
    return ((this.baseForm.get(field).touched || this.baseForm.get(field).dirty) && !this.baseForm.get(field).valid);
  }

  private getErrorMessage(field: string): void {
    const { errors } = this.baseForm.get(field);

    if (errors) {
      const minlenght = errors?.minlength?.requiredLength;
      const messages = {
        required: 'es requerido!',
        pattern: `es ivalido!`,
        minlength: `debe contener al ${minlenght} caracteres`,
      };
      const errorKey = Object.keys(errors).find(Boolean);
      this.errorMessage[field] = 'El campo ' + messages[errorKey];
    } else {
      this.errorMessage[field] = null;
    }
  }

  onReset(): void {
    this.baseForm.reset();
  }
}
