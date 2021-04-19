import {NgModule} from '@angular/core';
import {JoditAngularModule} from 'jodit-angular';
import {SharedModule} from '@shared/shared.module';

import {ModalTemplateCardsComponent,} from './components/modal/modal-template-cards.component';
import {TemplatesCardsRoutingModule} from './templates-cards-routing.module';
import {TemplatesCardsComponent} from './templates-cards.component';
import { TemplateCardModule } from '@pages/publisher/template-card/template-card.module';

@NgModule({
  declarations: [TemplatesCardsComponent, ModalTemplateCardsComponent],
  imports: [
    TemplatesCardsRoutingModule,
    TemplateCardModule,
    JoditAngularModule,
    SharedModule
  ]
})
export class TemplatesCardsModule {
}
