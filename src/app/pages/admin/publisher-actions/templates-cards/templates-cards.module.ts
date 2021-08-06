import { NgModule } from '@angular/core';
import { JoditAngularModule } from 'jodit-angular';

import { ModalTemplateCardsComponent } from './components/modal-template-cards/modal-template-cards.component';
import { TemplatesCardsRoutingModule } from './templates-cards-routing.module';
import { TemplatesCardsComponent } from './templates-cards.component';
import { TemplateCardModule } from '@pages/admin/publisher-actions/templates-cards/components/template-card/template-card.module';
import { SharedModule } from '@appShared/shared.module';

@NgModule({
  declarations: [TemplatesCardsComponent, ModalTemplateCardsComponent],
  imports: [
    TemplatesCardsRoutingModule,
    TemplateCardModule,
    JoditAngularModule,
    SharedModule
  ],
})
export class TemplatesCardsModule {
}
