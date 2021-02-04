import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsDayRoutingModule } from './events-day-routing.module';
import { EventsDayComponent } from './events-day.component';
import { ModalEventDayComponent } from './components/modal-event-day/modal-event-day.component';


@NgModule({
  declarations: [EventsDayComponent, ModalEventDayComponent],
  imports: [
    CommonModule,
    EventsDayRoutingModule
  ]
})
export class EventsDayModule { }
