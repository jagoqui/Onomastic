import { Injectable, NgIterable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormErrorsService } from '@appShared/services/form-errors.service';

@Injectable({ providedIn: 'root' })
export class BaseFormPublisher {

  public baseForm = this.createBaseForm();
  private emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  get associationsIterable(): (FormArray & NgIterable<FormGroup>) | undefined | null {
    return this.associations.controls as (FormArray & NgIterable<FormGroup>) | undefined | null;
  }

  get associations(): FormArray{
    return this.baseForm.get('asociacionPorUsuarioCorreo') as FormArray;
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
      password:['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      estado: ['', [Validators.required]],
      rol: this.fb.group({
        id: [null, [Validators.required]],
        nombre: [null, [Validators.required]]
      }),
      asociacionPorUsuarioCorreo: this.fb.array([this.createAssociationField()]),
    });
  }


  addAssociation() {
    this.associationsIterable.push(this.createAssociationField());
  }

  removeAssociation(i: number) {
    if (confirm('Seguro que desea quitar ésta asociación?')) {
      this.associations.removeAt(i);
    }
  }

  clearParameter(index: number) {
    this.associationsIterable.at(index).get('parametro').setValue(null);
  }

  onSearchErrors(field: AbstractControl | FormGroup){
    return this.formErrorsSvc.searchErrors(field);
  }

  onReset(): void {
    for (let i = this.associationsIterable.length - 1; i > 0; i--) {
      this.associationsIterable.removeAt(i);
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
