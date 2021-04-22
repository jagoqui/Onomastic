import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormErrorsService } from '@appShared/services/form-errors.service';

@Injectable({ providedIn: 'root' })
export class BaseFormPublisher {
  errorsMessage = {
    nombre: '',
    email: '',
    estado: '',
    apellido: '',
    rol: this.createByNameArrayError('id'),
    asociacionPorUsuarioCorreo: this.createByNameArrayError('id')
  };
  baseForm = this.createBaseForm();
  private emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  constructor(
    private fb: FormBuilder,
    private formErrorsSvc: FormErrorsService) {
  }

  createBaseForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      role: this.fb.group({
        id: ['', [Validators.required]],
        name: ['', [Validators.required]]
      }),
      asociacionPorUsuarioCorreo: this.fb.array([this.createByNameFormGroup('id')]),
      estado: ['', [Validators.required]]
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

  addByNameArrayError(arrayError: string) {
    const byNameErrorArray = this.errorsMessage[arrayError] as Array<any>;
    byNameErrorArray.push(this.createByNameArrayError(arrayError === 'programaAcademicoPorUsuarioCorreo' ? 'codigo' : 'id'));
  }

  addByNameFormGroup(formGroup: string) {
    const byName = this.baseForm.get(formGroup) as FormArray;
    byName.push(this.createByNameFormGroup(formGroup === 'programaAcademicoPorUsuarioCorreo' ? 'codigo' : 'id'));
    this.addByNameArrayError(formGroup);
  }

  removeOrClearByNameArrayError(i: number, arrayError: string) {
    const byNameErrorArray = this.errorsMessage[arrayError] as Array<any>;
    if (byNameErrorArray.length > 1) {
      byNameErrorArray.splice(i, i);
    } else {
      byNameErrorArray.splice(byNameErrorArray.length + 1);
    }
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

  // private createAssociationField() {
  //   return this.fb.group({
  //     id: ['', Validators.required],
  //     name: ['', Validators.required]
  //   });
  // }

}
