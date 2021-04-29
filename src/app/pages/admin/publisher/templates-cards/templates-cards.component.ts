import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';

import { TemplateCardsService } from '../shared/services/template-cards.service';
import { ModalTemplateCardsComponent } from './components/modal-template-cards/modal-template-cards.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateCard } from '@adminShared/models/template-card.model';
import { DomSanitizerService } from '@appShared/services/dom-sanitizer.service';
import { LoaderService } from '@appShared/services/loader.service';

@Component({
  selector: 'app-templates-cards',
  templateUrl: './templates-cards.component.html',
  styleUrls: ['./templates-cards.component.scss']
})
export class TemplatesCardsComponent implements OnInit, AfterViewInit {
  cards: TemplateCard[];
  onViewCard = true;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private domSanitizerSvc: DomSanitizerService,
    private templateCardsService: TemplateCardsService,
    public loaderSvc: LoaderService,
    private router: Router
  ) {
  }

  sanitizeHTML(card: string): SafeHtml {
    return this.domSanitizerSvc.sanitizeHTML(card);
  }

  onOpenModal(card = {}): void {
    this.onViewCard = false;
    const dialogRef = this.dialog.open(ModalTemplateCardsComponent, {
      height: 'auto',
      width: '95%',
      panelClass: 'app-full-bleed-dialog',
      hasBackdrop: true,
      disableClose: true,
      data: { title: card ? 'EDITAR PLANTILLA' : 'NUEVA PLANTILLA', card }
    });
    dialogRef.afterClosed().subscribe(_ => {
      this.onViewCard = true;
      this.router.navigate(['PUBLISHER/templates-cards/', '']).then(_ => {
      });
      this.ngAfterViewInit();
    });
  }

  onRefresh(refreshEvent?: boolean) {
    if (refreshEvent || refreshEvent !== false) {
      this.ngAfterViewInit();
    }
  }

  ngAfterViewInit(): void {
    this.templateCardsService.getAllCards().subscribe(cards => {
      if (cards) {
        this.cards = cards;
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.templateCardsService.getCardById(+id as number).subscribe((card) => {
        if (card) {
          this.onOpenModal(card);
        }
      });
    }
  }
}
