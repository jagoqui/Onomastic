import {Injectable} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

@Injectable({providedIn: 'root'})
export class BaseFormAuth {
  errorMessage = {
    userEmail: '',
    password: '',
    recaptchaKey: 'No marcado'
  };

  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  baseForm = this.fb.group({
    // userEmail: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    //TODO: Hacer valide si es un email, si detecta que es un correo.
    userEmail: ['', [Validators.required]],
    password: ['', [Validators.required]],
    recaptchaKey: [null, Validators.required],
  });


  constructor(private fb: FormBuilder) {
  }

  isValidField(field: string): boolean {
    this.getErrorMessage(field);
    return (((this.baseForm.get(field).touched || this.baseForm.get(field).dirty) && !this.baseForm.get(field).valid));
  }

  onReset(): void {
    this.baseForm.reset();
  }

  private getErrorMessage(field: string): void {
    const {errors} = this.baseForm.get(field);

    if (errors) {
      const messages = {
        required: ' es requerido!',
        pattern: ` es ivalido!`,
      };
      const errorKey = Object.keys(errors).find(Boolean);
      this.errorMessage[field] = 'El campo ' + `${field}` + messages[errorKey];
    } else {
      this.errorMessage[field] = null;
    }
  }

}

