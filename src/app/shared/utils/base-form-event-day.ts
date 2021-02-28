import {Injectable} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';

@Injectable({providedIn: 'root'})
export class BaseFormEventDay {

  public baseForm = this.createBaseForm();

  constructor(private fb: FormBuilder) {
  }

  get conditionsAssociationField() {
    return this.baseForm.get('asociacion') as FormArray;
  }

  get conditionsOptionsField() {
    return this.baseForm.get('condicionesEvento') as FormArray;
  }

  createBaseForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      fecha: ['', [Validators.required, this.validDate]],
      estado: ['', [Validators.required]], // TODO: Crear tipo de dato ACTIVO, INACTIVO
      recurrencia: ['', [Validators.required]], // TODO: Crear tipo de dato ANUAL, DIARIA
      asociacion: this.fb.array([]),
      condicionesEvento: this.fb.array([this.createConditionField()]),
      plantilla: this.fb.group({
        id: ['', [Validators.required]],
        texto: ['', [Validators.required]],
        asociacionesPorPlantilla: this.fb.array([new FormGroup({
          id: new FormControl('', Validators.required),
          nombre: new FormControl('', Validators.required)
        })])
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

  addAssociationOptions() {
    this.conditionsAssociationField.push(this.createAssociationField());
  }

  removeAssociation(key: number) {
    this.conditionsAssociationField.removeAt(key);
  }

  addConditionsOptions() {
    this.conditionsOptionsField.push(this.createConditionField());
  }

  removeCondition(key: number) {
    if (confirm('Seguro que desea quitar ésta condición?')) {
      this.conditionsOptionsField.removeAt(key);
    }
  }

  clearCondition(index: number) {
    this.conditionsOptionsField.at(index).get('parametro').setValue('');
  }

  // <mat-select formControlName="condition" (selectionChange)="limpiar(i)">
  isValidField(field: string, group?: string, i?: number): boolean {
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

  onReset(): void {
    for (let i = 0; i <  this.baseForm.controls.condicionesEvento.value.length; i++) {
      this.conditionsOptionsField.removeAt(i);
    }
    this.baseForm.reset();
  }

  private createAssociationField() {
    return this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required]
    });
  }

  private createConditionField() {
    return this.fb.group({
      id: [null, Validators.required],
      condicion: [null, Validators.required],
      parametro: [null, Validators.required]
    });
  }
}



