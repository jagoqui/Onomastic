import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalEventDayComponent } from './components/modal-event-day/modal-event-day.component';
import { EventsDayRoutingModule } from './events-day-routing.module';
import { EventsDayComponent } from './events-day.component';
import { TemplateCardModule } from '@pages/publisher/template-card/template-card.module';
import { MaterialModule } from '@app/material-module.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '@shared/shared.module';

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
