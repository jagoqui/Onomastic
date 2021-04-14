import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';
import { TemplateCard } from '@shared/models/template-card.model';
import { DomSanitizerService } from '@shared/services/dom-sanitizer.service';
import { LoaderService } from '@shared/services/loader.service';

import { TemplateCardsService } from '../services/template-cards.service';
import { ModalTemplateCardsComponent } from './components/modal/modal-template-cards.component';
import SwAlert from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

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
    dialogRef.afterClosed().subscribe(res => {
      this.onViewCard = true;
      this.router.navigate(['PUBLISHER/templates-cards/', '']).then(_ => {});
      this.ngAfterViewInit();
    });
  }

  onRefresh(refreshEvent?: boolean) {
    if(refreshEvent || refreshEvent !== false){
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
    const id= this.route.snapshot.paramMap.get('id');
    if(id){
      this.templateCardsService.getCardById(+id as number).subscribe((card) =>{
        if(card){
          this.onOpenModal(card);
        }
      });
    }
  }
}
