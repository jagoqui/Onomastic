
import { Injectable, NgIterable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormErrorsService } from '@appShared/services/form-errors.service';

@Injectable({ providedIn: 'root' })
export class BaseFormPublisher {

  public baseForm = this.createBaseForm();

  get associations(): FormArray{
    return this.baseForm.get('asociacionPorUsuario') as FormArray;
  }

  get controls(): { [p: string]: AbstractControl } {
    return this.baseForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private formErrorsSvc: FormErrorsService) {
  }

  createBaseForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      estado: ['', [Validators.required]],
      rol: this.fb.group({
        id: [null, [Validators.required]],
        nombre: [null, [Validators.required]]
      }),
      asociacionPorUsuario: this.fb.array([this.createAssociationField()]),
    });
  }


  addAssociation() {
    this.associations.push(this.createAssociationField());
  }

  removeAssociation(i: number) {
    if (confirm('Seguro que desea quitar ésta asociación?')) {
      this.associations.removeAt(i);
    }
  }

  onSearchErrors(field: AbstractControl | FormGroup){
    return this.formErrorsSvc.searchErrors(field);
  }

  onReset(): void {
    for (let i = this.associations.length - 1; i > 0; i--) {
      this.associations.removeAt(i);
    }
    this.baseForm.reset();
  }

  private createAssociationField(): FormGroup {
    return this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required]
    });
  }

}
