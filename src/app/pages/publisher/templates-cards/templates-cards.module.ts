import {NgModule} from '@angular/core';
import {JoditAngularModule} from 'jodit-angular';
import {SharedModule} from 'src/app/shared/shared.module';

import {ModalTemplateCardsComponent,} from './components/modal/modal-template-cards.component';
import {TemplatesCardsRoutingModule} from './templates-cards-routing.module';
import {TemplatesCardsComponent} from './templates-cards.component';
import { PublisherModule } from '@pages/¨publisher/publisher.module';

@NgModule({
  declarations: [TemplatesCardsComponent, ModalTemplateCardsComponent],
  imports: [
    TemplatesCardsRoutingModule,
    JoditAngularModule,
    SharedModule,
    PublisherModule
  ]
})
export class TemplatesCardsModule {
}
