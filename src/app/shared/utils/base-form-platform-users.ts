import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class BaseFormPlatformUsers {
  private emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  // private passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}';
  errorMessage = {
    name: '',
    userEmail: '',
    password: '',
    recaptcha: 'No marcado',
    association: '',
    role: ''
  };

  constructor(private fb: FormBuilder) { }

  baseForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(10)]],
    userEmail: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    password: ['', [Validators.required]],
    recaptcha: ['', Validators.required],
    association: ['', [Validators.required]],
    role: ['', [Validators.required]],
  });

  isValidField(field: string): boolean {
    this.getErrorMessage(field);
    return (((this.baseForm.get(field).touched || this.baseForm.get(field).dirty) && !this.baseForm.get(field).valid));
  }

  private getErrorMessage(field: string): void {
    const { errors } = this.baseForm.get(field);

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

  onReset(): void {
    this.baseForm.reset();
  }

}

