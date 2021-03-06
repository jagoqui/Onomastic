import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SharedModule} from 'src/app/shared/shared.module';

import {ModalEventDayComponent,} from './components/modal-event-day/modal-event-day.component';
import {EventsDayRoutingModule} from './events-day-routing.module';
import {EventsDayComponent} from './events-day.component';

@NgModule({
  declarations: [EventsDayComponent, ModalEventDayComponent],
  imports: [
    CommonModule,
    EventsDayRoutingModule,
    SharedModule
  ]
})
export class EventsDayModule {

}
