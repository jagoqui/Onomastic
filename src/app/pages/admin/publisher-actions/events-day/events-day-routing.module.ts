import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {EventsDayComponent} from './events-day.component';

const routes: Routes = [{path: '', component: EventsDayComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsDayRoutingModule {
}
