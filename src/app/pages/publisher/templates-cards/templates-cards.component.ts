import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SafeHtml} from '@angular/platform-browser';
import {Plantilla} from '@app/shared/models/template-card.model';
import {DomSanitizerService,} from '@app/shared/services/dom-sanitizer.service';
import {LoaderService} from '@app/shared/services/loader.service';

import {TemplateCardsService} from '../services/template-cards.service';
import {ModalTemplateCardsComponent,} from './components/modal/modal-template-cards.component';

@Component({
  selector: 'app-templates-cards',
  templateUrl: './templates-cards.component.html',
  styleUrls: ['./templates-cards.component.scss']
})
export class TemplatesCardsComponent implements OnInit, AfterViewInit {
  cards: Plantilla[];
  onViewCard = true;

  constructor(
    private dialog: MatDialog,
    private domSanitizerSvc: DomSanitizerService,
    private templateCardsService: TemplateCardsService,
    public loaderSvc: LoaderService
  ) {
  }

  sanitizeHTML(card: string): SafeHtml {
    return this.domSanitizerSvc.sanitizeHTML(card);
  }

  onOpenModal(): void {
    this.onViewCard = false;
    const dialogRef = this.dialog.open(ModalTemplateCardsComponent, {
      height: 'auto',
      width: '95%',
      panelClass: 'app-full-bleed-dialog',
      hasBackdrop: true,
      disableClose: true,
      data: {title: 'Nueva tarjeta'},
    });
    dialogRef.afterClosed().subscribe(res => {
      this.onViewCard = true;
      this.ngAfterViewInit();
    });
  }

  onSelectCard(card: Plantilla): void {
  }

  ngAfterViewInit(): void {
    this.templateCardsService.getAllCards().subscribe(cards => {
      if (cards) {
        this.cards = cards;
      }
    });
  }

  ngOnInit(): void {
  }
}
