import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalEventDayComponent } from './components/modal-event-day/modal-event-day.component';
import { EventsDayRoutingModule } from './events-day-routing.module';
import { EventsDayComponent } from './events-day.component';
import { TemplateCardModule } from '@pages/admin/publisher/templates-cards/components/template-card/template-card.module';
import { SharedModule } from '@appShared/shared.module';



@NgModule({
  declarations: [EventsDayComponent, ModalEventDayComponent],
  imports: [
    CommonModule,
    EventsDayRoutingModule,
    TemplateCardModule,
    SharedModule
  ]
})
export class EventsDayModule {

}
