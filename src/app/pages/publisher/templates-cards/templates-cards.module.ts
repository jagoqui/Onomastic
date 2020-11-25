import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { TemplatesCardsRoutingModule } from './templates-cards-routing.module';
import { TemplatesCardsComponent } from './templates-cards.component';
import { ModalComponent } from './components/modal/modal.component';


@NgModule({
  declarations: [TemplatesCardsComponent, ModalComponent],
  imports: [
    CommonModule,
    TemplatesCardsRoutingModule,
    SharedModule
  ]
})
export class TemplatesCardsModule { }
