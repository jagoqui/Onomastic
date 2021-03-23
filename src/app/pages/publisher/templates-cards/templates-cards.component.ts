import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';
import { TemplateCard } from '@app/shared/models/template-card.model';
import { DomSanitizerService } from '@app/shared/services/dom-sanitizer.service';
import { LoaderService } from '@app/shared/services/loader.service';

import { TemplateCardsService } from '../services/template-cards.service';
import { ModalTemplateCardsComponent } from './components/modal/modal-template-cards.component';
import SwAlert from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

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
    public loaderSvc: LoaderService
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
      this.ngAfterViewInit();
    });
  }

  onEditCard(card: TemplateCard): void {
    SwAlert.fire({
      title: 'Qué desea hacer?',
      showDenyButton: true,
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: `Editar`,
      denyButtonText: `Eliminar`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.onOpenModal(card);
      } else if (result.isDenied) {
        SwAlert.fire({
          title: 'Está seguro?',
          text: 'Si elimina ésta plantilla se eliminará tambien los eventos asociados, lo cambios no podrán revertirse!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminarla!',
          cancelButtonText: 'Cancelar'
        }).then((resultDelete) => {
          if (resultDelete.isConfirmed) {
            this.templateCardsService.delete(card.id).subscribe((cardRes) => {
              SwAlert.fire('Eliminado!', 'La plantilla se ha eliminado', 'success').then(r => console.log(r));
              this.ngAfterViewInit();

            }, (err) => {
              SwAlert.fire({
                icon: 'error',
                html: '',
                title: 'Oops...',
                text: ' Algo salió mal!',
                footer: `${err}`
              }).then(r => console.log(r));
            });
          }
        });
      }
    });
  }

  onRefresh() {
    this.ngAfterViewInit();
  }

  ngAfterViewInit(): void {
    this.templateCardsService.getAllCards().subscribe(cards => {
      if (cards) {
        this.cards = cards;
      }
    });
  }

  ngOnInit(): void {
    const card = this.route.snapshot.paramMap.get('card');
    if(card){
      this.onOpenModal(card);
    }
  }
}
