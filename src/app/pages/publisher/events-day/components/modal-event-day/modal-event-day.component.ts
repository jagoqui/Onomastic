import { Component, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  TemplateCardsService,
} from '@app/pages/publisher/services/template-cards.service';
import { Plantilla } from '@app/shared/models/template-card.model';
import { FormConditionsOptions } from '@app/pages/publisher/services/form-conditions-options.services';
import { FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal-event-day.component.html',
  styleUrls: ['./modal-event-day.component.scss']
})
export class ModalEventDayComponent implements OnInit {
  name: string;
  cards: Plantilla[] = [];
  selecCond = '';
  sidenavOpened = false;
  genders = ['MASCULINO', 'FEMENINO', 'OTRO'];
  schools: any[] = [];
  associations: any[] = [];
  programs: any[] = [];
  conditions = ['Genero', 'Facultad/Escuela', 'Vinculación', 'Programa'];
  eventForm = this.fb.group({
    eventName: [''],
    eventDate: [''],
    enventRecurrency: [''],
    conditionsOptions: this.fb.array([
      this.fb.control('')
    ])
  });

  constructor(
    private dialogRef: MatDialogRef<ModalEventDayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private templateCardsSevice: TemplateCardsService,
    private formConditionsOptionsService: FormConditionsOptions,

    private fb: FormBuilder
  ) { }

  get conditionsOptions(){
    return this.eventForm.get('conditionsOptions') as FormArray;
  }

  addCondition(){
    console.log(this.eventForm);
    this.conditionsOptions.push(this.fb.control(''));
  }

  removeCondition(indice: number) {
    this.conditionsOptions.removeAt(indice);
  }

  loadCards() {
    this.sidenavOpened = true;
    this.templateCardsSevice.getAllCards().subscribe(cards => this.cards = cards);
  }

  onClose(close?: boolean): void {
    if (close ? close : confirm('No ha guardado los cambios, desea salir?')) {
      this.dialogRef.close();
    }
  }

  onSave() {
  }

  ngOnInit(): void {
    this.formConditionsOptionsService.getSchools().subscribe(data => {
      this.schools = data;
    });
    this.formConditionsOptionsService.getPrograms().subscribe(data => {
      this.programs = data;
    });
    this.formConditionsOptionsService.getAsociations().subscribe(data => {
      this.associations = data;
    });
  }
}
