import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormErrorsService } from '@appShared/services/form-errors.service';

@Injectable({ providedIn: 'root' })
export class BaseFormPublisher {

  public baseForm = this.createBaseForm();

  constructor(
    private fb: FormBuilder,
    private formErrorsSvc: FormErrorsService) {
  }

  get controls(): { [p: string]: AbstractControl } {
    return this.baseForm.controls;
  }

  createBaseForm(): FormGroup {
    return this.fb.group({
      id: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      estado: ['', [Validators.required]],
      rol: this.fb.group({
        id: [null],
        nombre: [null]
      }, Validators.required),
      unidadAcademicaPorUsuario: [this.createAssociationField(), Validators.required],
      unidadAdministrativaPorUsuario: [this.createAssociationField(), Validators.required]
    });
  }

  onSearchErrors(field: AbstractControl | FormGroup) {
    return this.formErrorsSvc.searchErrors(field);
  }

  private createAssociationField(): FormGroup {
    return this.fb.group({
      id: [null],
      nombre: [null]
    });
  }

}
