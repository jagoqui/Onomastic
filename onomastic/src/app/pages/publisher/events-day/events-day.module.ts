import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsDayRoutingModule } from './events-day-routing.module';
import { EventsDayComponent } from './events-day.component';


@NgModule({
  declarations: [EventsDayComponent],
  imports: [
    CommonModule,
    EventsDayRoutingModule
  ]
})
export class EventsDayModule { }
