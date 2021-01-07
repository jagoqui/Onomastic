import { NgModule } from '@angular/core';
import { JoditAngularModule } from 'jodit-angular';
import { SharedModule } from 'src/app/shared/shared.module';

import { ModalComponent } from './components/modal/modal.component';
import { TemplatesCardsRoutingModule } from './templates-cards-routing.module';
import { TemplatesCardsComponent } from './templates-cards.component';

@NgModule({
  declarations: [TemplatesCardsComponent, ModalComponent],
  imports: [
    TemplatesCardsRoutingModule,
    JoditAngularModule,
    SharedModule,
  ]
})
export class TemplatesCardsModule { }
