import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';
import {
  TemplateCardsService,
} from '@app/pages/publisher/services/template-cards.service';
import { Plantilla } from '@shared/models/template-card.model';
import { DomSanitizerService } from '@shared/services/dom-sanitizer.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal-event-day.component.html',
  styleUrls: ['./modal-event-day.component.scss']
})
export class ModalEventDayComponent implements OnInit {
  cards: Plantilla[] = [];
  sidenavOpened = false;
  selectCardHTML: SafeHtml = null;

  constructor(
    private dialogRef: MatDialogRef<ModalEventDayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private templateCardsSevice: TemplateCardsService,
    private domSanitazerSvc: DomSanitizerService
  ) { }

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
  }
}
