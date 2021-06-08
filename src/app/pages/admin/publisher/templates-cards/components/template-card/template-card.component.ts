import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import SwAlert from 'sweetalert2';
import { TemplateCardsService } from '@publisher/shared/services/template-cards.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventDayService } from '@publisher/shared/services/event-day.service';
import { TemplateCard } from '@adminShared/models/template-card.model';
import { DomSanitizerService } from '@appShared/services/dom-sanitizer.service';

@Component({
  selector: 'app-template-card',
  template:`
    <article class='wrapper-card' *ngIf='card'>
      <div class='card-container' [innerHTML]='this.domSanitizerSvc.sanitizeHTML(card.texto)'></div>
      <div *ngIf='actions' class='card_actions'>
        <button mat-mini-fab color='primary' (click)='onEditCard(card.id)' title='Click para editar plantilla'>
          <mat-icon>edit</mat-icon>
        </button>
        <button mat-mini-fab color='warn' (click)='onDeleteCard(card)' title='Click para eliminar plantilla'>
          <mat-icon>delete</mat-icon>
        </button>
      </div>
    </article>
  `,
  styleUrls: ['./template-card.component.scss']
})
export class TemplateCardComponent implements OnDestroy {
  @Input() card: TemplateCard | undefined;
  @Input() actions = true;
  @Output() refreshCards = new EventEmitter(false);

  private destroy$ = new Subject<any>();

  constructor(
    public domSanitizerSvc: DomSanitizerService,
    private templateCardsService: TemplateCardsService,
    private eventDaySvc: EventDayService,
    private router: Router
  ) {
  }

  onEditCard(id: number): void {
    this.router.navigateByUrl('/PUBLISHER', { skipLocationChange: true }).then(() =>
      this.router.navigate(['PUBLISHER/templates-cards/', id]).then());
  }

  onDeleteCard(card: TemplateCard) {
    this.eventDaySvc.getAssociatedEvents(card.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((events) => {
          const ol = document.createElement('ol');
          for (const event of events) {
            const li = document.createElement('li');
            li.append(`Nombre: ${event.nombre}, Estado: ${event.estado}`);
            li.style.fontSize = '12px';
            li.style.color = 'orange';
            ol.appendChild(li);
          }
          const html = ol.hasChildNodes() ? `
            <span>Si elimina ésta plantilla se eliminará tambien los siguientes eventos asociados.</span><br>'
            <div style='text-align:justify'>${ol.innerHTML}</div>
          ` : '';
          SwAlert.fire({
            title: 'Está seguro?. Los cambios no podrán revertirse!',
            html,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarla!',
            cancelButtonText: 'Cancelar'
          }).then((resultDelete) => {
            if (resultDelete.isConfirmed) {
              this.templateCardsService.delete(card.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                  SwAlert.fire('Eliminado!', 'La plantilla se ha eliminado', 'success').then();
                  this.refreshCards.emit(true);
                }, () => SwAlert.showValidationMessage('La plantilla no se pudo eliminar'));
            }
          });
        },() => SwAlert.showValidationMessage('No se pudo cargar los eventos.A')
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  };
}
