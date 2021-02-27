import {NgModule} from '@angular/core';
import {JoditAngularModule} from 'jodit-angular';
import {SharedModule} from 'src/app/shared/shared.module';

import {ModalTemplateCardsComponent,} from './components/modal/modal-template-cards.component';
import {TemplatesCardsRoutingModule} from './templates-cards-routing.module';
import {TemplatesCardsComponent} from './templates-cards.component';

@NgModule({
  declarations: [TemplatesCardsComponent, ModalTemplateCardsComponent],
  imports: [
    TemplatesCardsRoutingModule,
    JoditAngularModule,
    SharedModule,
  ]
})
export class TemplatesCardsModule {
}
