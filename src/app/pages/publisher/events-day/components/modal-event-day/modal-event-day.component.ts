import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';
import {
  FormConditionsOptions,
} from '@app/pages/publisher/services/form-conditions-options.services';
import {
  TemplateCardsService,
} from '@app/pages/publisher/services/template-cards.service';
import { Plantilla } from '@app/shared/models/template-card.model';
import { DomSanitizerService } from '@shared/services/dom-sanitizer.service';

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
  selectCardHTML: SafeHtml = null;

  constructor(
    private dialogRef: MatDialogRef<ModalEventDayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private templateCardsSevice: TemplateCardsService,
    private formConditionsOptionsService: FormConditionsOptions,
    private fb: FormBuilder,
    private domSanitazerSvc: DomSanitizerService
  ) { }

  handleKeyDown(event: any) {
    if (event.keyCode === 'Enter') {
      event.default();
    }
  }

  get conditionsOptions() {
    return this.eventForm.get('conditionsOptions') as FormArray;
  }

  addCondition() {
    console.log(this.eventForm);
    this.conditionsOptions.push(this.fb.control(''));
  }

  removeCondition(indice: number) {
    this.conditionsOptions.removeAt(indice);
  }

  sanatizeHTML(cardText: string): SafeHtml {
    return this.domSanitazerSvc.sanatizeHTML(cardText);
  }

  loadCards(onChange?: boolean) {
    if (onChange) {
      if (confirm('Seguro que desea ver las plantillas?')) {
        this.sidenavOpened = true;
        this.templateCardsSevice.getAllCards().subscribe(cards => this.cards = cards);
      }
    } else {
      this.sidenavOpened = true;
      this.templateCardsSevice.getAllCards().subscribe(cards => this.cards = cards);
    }
  }

  onSelectCard(card: Plantilla) {
    if (confirm('Seguro que desea seleccionar ésta plantilla?')) {
      this.selectCardHTML = this.sanatizeHTML(card.texto);
      this.sidenavOpened = false;
    }
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
