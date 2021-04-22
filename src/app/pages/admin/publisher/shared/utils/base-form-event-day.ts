import {Injectable} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import { FormErrorsService } from '@appShared/services/form-errors.service';

@Injectable({providedIn: 'root'})
export class BaseFormEventDay {

  public baseForm = this.createBaseForm();

  constructor(
    private fb: FormBuilder,
    private formErrorsSvc: FormErrorsService
  ) {
  }

  get conditionsOptionsField() {
    return this.baseForm.get('condicionesEvento') as FormArray;
  }

  createBaseForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(45)]],
      fecha: ['', [Validators.required, this.validDate]],
      estado: ['', [Validators.required]], // TODO: Crear tipo de dato ACTIVO, INACTIVO
      recurrencia: ['', [Validators.required]], // TODO: Crear tipo de dato ANUAL, DIARIA
      condicionesEvento: this.fb.array([this.createConditionField()]),
      plantilla: this.fb.group({
        id: ['', [Validators.required]],
        texto: ['', [Validators.required]]
      }),
    });
  }

  validDate(control: FormControl): { [key: string]: any } | null {
    const date = control.value;

    return moment(date, 'YYYY-MM-DD', true).isValid() ?
      null : {
        invalidDate: true
      };
  }

  addConditionsOptions() {
    this.conditionsOptionsField.push(this.createConditionField());
  }

  removeCondition(key: number) {
    if (confirm('Seguro que desea quitar ésta condición?')) {
      this.conditionsOptionsField.removeAt(key);
    }
  }

  clearParameter(index: number) {
    this.conditionsOptionsField.at(index).get('parametro').setValue(null);
  }

  mapErrors(control: AbstractControl, name: string): string[] {
    return !this.isValidField(control) ? this.formErrorsSvc.mapErrors(control, name) : null;
  }

  isValidField(control: AbstractControl): boolean {
    return !((control.touched || control.dirty) && control.invalid);
  }

  onReset(): void {
    for (let i = this.conditionsOptionsField.length-1; i > 0 ; i--) {
      this.conditionsOptionsField.removeAt(i);
    }
    this.baseForm.reset();
  }

  private createConditionField() {
    return this.fb.group({
      condicion: ['', Validators.required],
      parametro: ['', Validators.required]
    });
  }
}



