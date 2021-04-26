import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { FormErrorsService } from '@appShared/services/form-errors.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Injectable({ providedIn: 'root' })
export class BaseFormEventDay {

  public baseForm = this.createBaseForm();

  constructor(
    private fb: FormBuilder,
    private formErrorsSvc: FormErrorsService
  ) {
  }

  get conditions(): FormArray {
    return this.baseForm.get('condicionesEvento') as FormArray;
  }

  get controls(): { [p: string]: AbstractControl } {
    return this.baseForm.controls;
  }

  createBaseForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(45)]],
      fecha: ['', [Validators.required, this.validDate]],
      estado: ['', [Validators.required]],
      recurrencia: ['', [Validators.required]],
      condicionesEvento: this.fb.array([this.createConditionField()]),
      plantilla: this.fb.group({
        id: [null, [Validators.required]],
        texto: [null, [Validators.required]]
      })
    });
  }

  setDate(event: MatDatepickerInputEvent<unknown>) {
    this.baseForm.controls.fecha.setValue(moment(event.value).format('YYYY-MM-DD'));
  }

  validDate(control: FormControl): { [key: string]: any } | null {
    const date = control.value;
    return moment(date, 'YYYY-MM-DD', true).isValid() ?
      null : {
        invalidDate: true
      };
  }

  addCondition() {
    this.conditions.push(this.createConditionField());
  }

  removeCondition(key: number) {
    if (confirm('Seguro que desea quitar ésta condición?')) {
      this.conditions.removeAt(key);
    }
  }

  clearParameter(index: number) {
    this.conditions.at(index).get('parametro').setValue(null);
  }

  onSearchErrors(field: AbstractControl | FormGroup){
    return this.formErrorsSvc.searchErrors(field);
  }

  onReset(): void {
    for (let i = this.conditions.length - 1; i > 0; i--) {
      this.conditions.removeAt(i);
    }
    this.baseForm.reset();
  }

  private createConditionField(): FormGroup {
    return this.fb.group({
      condicion: ['', Validators.required],
      parametro: ['', Validators.required]
    });
  }
}



