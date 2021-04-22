import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { TemplateCard } from '@shared/models/template-card.model';
import { DomSanitizerService } from '@shared/services/control/dom-sanitizer.service';
import SwAlert from 'sweetalert2';
import { TemplateCardsService } from '@pages/publisher/services/template-cards.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-template-card',
  templateUrl: './template-card.component.html',
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
    private router: Router
  ) {
  }

  onEditCard(id: number): void {
    this.router.navigateByUrl('/PUBLISHER', { skipLocationChange: true }).then(() =>
      this.router.navigate(['PUBLISHER/templates-cards/', id]).then());
  }

  onDeleteCard(card: TemplateCard) {
    this.templateCardsService.getAssociatedEvents(card.id)
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
            <span>Si elimina ésta plantilla se eliminará tambien los siquiente eventos asociados.</span><br>'
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
              this.templateCardsService.delete(card.id).subscribe((cardRes) => {
                SwAlert.fire('Eliminado!', 'La plantilla se ha eliminado', 'success').then();
                this.refreshCards.emit(true);
              });
            }
          });
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  };
}
