import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SharedModule} from '@shared/shared.module';

import {ModalEventDayComponent,} from './components/modal-event-day/modal-event-day.component';
import {EventsDayRoutingModule} from './events-day-routing.module';
import {EventsDayComponent} from './events-day.component';
import { TemplateCardModule } from '@pages/publisher/template-card/template-card.module';

@NgModule({
  declarations: [EventsDayComponent, ModalEventDayComponent],
	imports: [
		CommonModule,
		EventsDayRoutingModule,
		SharedModule,
		TemplateCardModule
	]
})
export class EventsDayModule {

}
