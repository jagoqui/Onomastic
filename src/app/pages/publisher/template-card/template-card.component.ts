import { OnDestroy, Component, Input, EventEmitter, Output } from '@angular/core';
import { TemplateCard } from '@shared/models/template-card.model';
import { DomSanitizerService } from '@shared/services/dom-sanitizer.service';
import SwAlert from 'sweetalert2';
import { TemplateCardsService } from '@pages/¨publisher/services/template-cards.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template-card',
  templateUrl: './template-card.component.html',
  styleUrls: ['./template-card.component.scss']
})
export class TemplateCardComponent{
  @Input() card: TemplateCard | undefined;
  @Output() refreshCards = new EventEmitter(false);

  constructor(
    public domSanitizerSvc: DomSanitizerService,
    private templateCardsService: TemplateCardsService,
    private router: Router
  ) {
  }

  onEditCard(id: number): void {
    this.router.navigateByUrl('/PUBLISHER', { skipLocationChange: true }).then(() =>
      this.router.navigate(['PUBLISHER/templates-cards/', id]).then(r => console.log('Open route: ,', r)));
  }

  onDeleteCard(card: TemplateCard) {
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
          this.refreshCards.emit(true);
        });
      }
    });
  }
}
