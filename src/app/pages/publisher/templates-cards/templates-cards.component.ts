import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';
import { Plantilla } from '@app/shared/models/template-card.model';
import {
  DomSanitizerService,
} from '@app/shared/services/dom-sanitizer.service';
import { LoaderService } from '@app/shared/services/loader.service';

import { TemplateCardsService } from '../services/template-cards.service';
import {
  ModalTemplateCardsComponent,
} from './components/modal/modal-template-cards.component';

@Component({
  selector: 'app-templates-cards',
  templateUrl: './templates-cards.component.html',
  styleUrls: ['./templates-cards.component.scss']
})
export class TemplatesCardsComponent implements OnInit, AfterViewInit {
  cards: Plantilla[];

  constructor(
    private dialog: MatDialog,
    private domSanitizerSvc: DomSanitizerService,
    private templateCardsSevice: TemplateCardsService,
    public loaderSvc: LoaderService
  ) { }

  sanatizeHTML(card: string): SafeHtml {
    return this.domSanitizerSvc.sanatizeHTML(card);
  }

  onOpenModal(): void {
    this.dialog.open(ModalTemplateCardsComponent, {
      height: 'auto',
      width: '95%',
      panelClass: 'app-full-bleed-dialog',
      hasBackdrop: true,
      disableClose: true,
      data: { title: 'Nueva tarjeta' },
    });
  }

  onSelectCard(card: Plantilla): void { }

  ngAfterViewInit(): void {
    this.templateCardsSevice.getAllCards().subscribe(cards => {
      if (cards) {
        this.cards = cards;
      }
    });
  }

  ngOnInit(): void { }
}
