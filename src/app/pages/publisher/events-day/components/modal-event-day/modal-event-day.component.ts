import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  TemplateCardsService,
} from '@app/pages/publisher/services/template-cards.service';
import { Plantilla } from '@app/shared/models/template-card.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal-event-day.component.html',
  styleUrls: ['./modal-event-day.component.scss']
})
export class ModalEventDayComponent implements OnInit {
  cards: Plantilla[] = [];
  sidenavOpened = false;
  form: FormGroup;
  maxListsConfig = {
    condition: 4
  };

  constructor(
    private dialogRef: MatDialogRef<ModalEventDayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private templateCardsSevice: TemplateCardsService
  ) { }

  loadCards() {
    this.sidenavOpened = true;
    this.templateCardsSevice.getAllCards().subscribe(cards => this.cards = cards);
  }

  getConditionsSize(): number {
    return this.condition.length;
  }

  onShowAddCondition(iterator: number): boolean {
    return (iterator === (this.getConditionsSize() - 1) && (this.getConditionsSize() < this.maxListsConfig.condition));
  }

  createForm() {
    this.form = this.fb.group({
      condition: this.fb.array([])
    });
  }

  get condition(): FormArray {
    return this.form.get('condition') as FormArray;
  }

  addCondition() {
    const cond = this.fb.group({
      condition: new FormControl(''),
    });
    this.condition.push(cond);
  }

  removeCondition(indice: number) {
    this.condition.removeAt(indice);
  }


  onClose(close?: boolean): void {
    if (close ? close : confirm('No ha guardado los cambios, desea salir?')) {
      this.dialogRef.close();
    }
  }

  onSave() {
  }

  ngOnInit(): void {
    this.createForm();
    this.addCondition();
  }
}
