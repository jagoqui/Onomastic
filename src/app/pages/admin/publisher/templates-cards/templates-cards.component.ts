import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';

import { TemplateCardsService } from '../shared/services/template-cards.service';
import { ModalTemplateCardsComponent } from './components/modal-template-cards/modal-template-cards.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateCard } from '@adminShared/models/template-card.model';
import { DomSanitizerService } from '@appShared/services/dom-sanitizer.service';
import { LoaderService } from '@appShared/services/loader.service';
import SwAlert from 'sweetalert2';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-templates-cards',
  template: `
    <div class='container'>
      <button mat-mini-fab color='primary' title='Nueva plantilla' (click)='onOpenModal(null)'>
        <mat-icon matBadge="+" matBadgeColor="warn" matBadgeSize='small'>card_giftcard</mat-icon>
      </button>
      <button class='reload-button' mat-mini-fab color='primary' title='Recargar plantillas' (click)='onRefresh()'>
        <mat-icon>refresh</mat-icon>
      </button>
      <section class='cards-container' *ngIf='this.onViewCard' fxLayoutAlign='center center'>
        <app-template-card *ngFor='let card of cards' [card]='card' (refreshCards)='onRefresh($event)'></app-template-card>
      </section>
    </div>
  `,
  styleUrls: ['./templates-cards.component.scss']
})
export class TemplatesCardsComponent implements OnInit, AfterViewInit, OnDestroy {
  cards: TemplateCard[];
  onViewCard = true;
  private destroy$ = new Subject<any>();

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
      width: '75%',
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
    }, () => SwAlert.showValidationMessage('Error obteniendo plantillas'));
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.templateCardsService.getCardById(+id as number).subscribe((card) => {
        if (card) {
          this.onOpenModal(card);
        }
      }, () => SwAlert.showValidationMessage('Error obteniendo plantilla'));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  };
}
