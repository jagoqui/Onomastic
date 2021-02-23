import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
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
  sidenavOpened = false;
  genders = ['MASCULINO', 'FEMENINO', 'OTRO'];
  schools: any[] = [];
  prueba: any[] = [];
  associations: any[] = [];
  programs: any[] = [];
  // conditions = [{name: 'Genero', isActive: true}, {name: 'Facultad/Escuela', isActive: true}, {name: 'Vinculacion', isActive: true}, {name: 'Programa', isActive: true}];
  conditions = ['Genero', 'Facultad/Escuela', 'Vinculación', 'Programa'];
  eventForm = this.fb.group({
    eventName: [''],
    eventDate: [''],
    enventRecurrency: [''],
    conditionsOptions: this.fb.group({
      default: ['default']
    })
  });
  countConditions = 1;
  selectCardHTML: SafeHtml = null;

  constructor(
    private dialogRef: MatDialogRef<ModalEventDayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private templateCardsSevice: TemplateCardsService,
    private formConditionsOptionsService: FormConditionsOptions,
    private domSanitazerSvc: DomSanitizerService,
    private fb: FormBuilder
  ) { }

  get conditionsOptions() {
    return this.eventForm.get('conditionsOptions') as FormArray;
  }

  updateForm(event: MatOptionSelectionChange, condition: any, option: any) {

    if (option !== '') {
      (this.eventForm.get('conditionsOptions') as FormGroup).addControl(condition, this.fb.control(option));
    }
    this.countConditions = Object.keys(this.conditionsOptions.value).length;
    console.log(this.eventForm);
  }

  removeCondition(key: string) {
    (this.eventForm.get('conditionsOptions') as FormGroup).removeControl(key);
    this.countConditions = Object.keys(this.conditionsOptions.value).length;
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

  sanatizeHTML(cardText: string): SafeHtml {
    return this.domSanitazerSvc.sanatizeHTML(cardText);
  }

  onClose(close?: boolean): void {
    if (close ? close : confirm('No ha guardado los cambios, desea salir?')) {
      this.dialogRef.close();
    }
  }

  onSave() {
    this.removeCondition('default');
    console.log(this.eventForm);
  }

  ngOnInit(): void {
    this.formConditionsOptionsService.getSchools().subscribe(data => {
      this.schools = data;
    });
    this.formConditionsOptionsService.getAsociations().subscribe(data => {
      this.associations = data;
    });
    this.formConditionsOptionsService.getPrograms().subscribe(data => {
      this.programs = data;
    });
  }
}
