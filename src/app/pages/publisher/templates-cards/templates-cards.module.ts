import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplatesCardsRoutingModule } from './templates-cards-routing.module';
import { TemplatesCardsComponent } from './templates-cards.component';


@NgModule({
  declarations: [TemplatesCardsComponent],
  imports: [
    CommonModule,
    TemplatesCardsRoutingModule
  ]
})
export class TemplatesCardsModule { }
