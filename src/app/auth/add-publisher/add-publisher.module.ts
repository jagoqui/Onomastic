import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AddPublisherRoutingModule} from './add-publisher-routing.module';
import {AddPublisherComponent} from './add-publisher.component';


@NgModule({
  declarations: [AddPublisherComponent],
  imports: [
    CommonModule,
    AddPublisherRoutingModule
  ]
})
export class AddPublisherModule {
}
