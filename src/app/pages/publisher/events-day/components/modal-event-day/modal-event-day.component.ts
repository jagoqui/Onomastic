import { Component, Inject, OnInit } from '@angular/core';
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

  constructor(
    private dialogRef: MatDialogRef<ModalEventDayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private templateCardsSevice: TemplateCardsService
  ) { }

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
  }
}
