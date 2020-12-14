import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ModalComponent } from './components/modal/modal.component';
import { TemplatesCardsRoutingModule } from './templates-cards-routing.module';
import { TemplatesCardsComponent } from './templates-cards.component';

@NgModule({
  declarations: [TemplatesCardsComponent, ModalComponent],
  imports: [
    TemplatesCardsRoutingModule,
    SharedModule,
  ]
})
export class TemplatesCardsModule { }
